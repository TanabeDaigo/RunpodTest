import logjs from "@metrojs/logjs";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
const log = new logjs("SendMail");

let sesClient;
let sqsClient;

class MailService {
  constructor(config) {
    this.config = config || {};
    /** @type {boolean} config.Nodemailer=true のとき SMTP（Nodemailer）を使用。デフォルト false（AWS SES） */
    this.useNodemailer = this.config.Nodemailer === true;
  }

  /**
   * Nodemailer 使用可否を解決（sendMail / checkData の引数で上書き可）
   * @param {boolean|undefined} override
   * @returns {boolean}
   */
  _resolveUseNodemailer(override) {
    if (override !== undefined) {
      return override === true;
    }
    return this.useNodemailer;
  }

  /**
   * 宛先を配列に正規化（配列 / ";" "," 区切り文字列に対応）
   * @param {string|string[]|undefined|null} field
   * @returns {string[]}
   */
  _normalizeAddressList(field) {
    if (field == null || field === "") {
      return [];
    }
    if (Array.isArray(field)) {
      return [...new Set(field.flatMap((v) => this._normalizeAddressList(v)).filter(Boolean))];
    }
    return [...new Set(String(field).split(/[;,]/).map((s) => s.trim()).filter(Boolean))];
  }

  /**
   * 添付配列を Nodemailer 形式に正規化
   * @param {Array<{ filename?: string, content: string|Buffer, contentType?: string }>|undefined} attachments
   * @returns {Array<{ filename: string, content: Buffer, contentType?: string }>}
   */
  _normalizeAttachmentsForNodemailer(attachments) {
    if (!Array.isArray(attachments)) {
      return [];
    }
    return attachments
      .filter((att) => att && att.content !== undefined && att.content !== null)
      .map((att) => {
        let content = att.content;
        if (typeof content === "string") {
          content = Buffer.from(content, "base64");
        } else if (!(content instanceof Buffer)) {
          content = Buffer.from(content);
        }
        return {
          filename: att.filename || "attachment",
          content,
          contentType: att.contentType,
        };
      });
  }

  /**
   * Nodemailer（SMTP / Postfix 等）経由でメール送信
   * @private
   */
  async _sendMailViaNodemailer({ mailTo, mailCc, mailBcc, mail_title, mail_text, attachments, is_debug }) {
    const toAddresses = this._normalizeAddressList(mailTo);
    const ccAddresses = this._normalizeAddressList(mailCc);
    const bccAddresses = this._normalizeAddressList(mailBcc);

    if (toAddresses.length === 0) {
      throw new Error("mailTo is required");
    }

    const host = this.config.smtp_host || process.env.SMTP_HOST || "127.0.0.1";
    const port = Number(this.config.smtp_port || process.env.SMTP_PORT || 25);
    const fromAddress =
      this.config.smtp_from || process.env.SMTP_FROM || process.env.ASES_FROM_ADDRESS || this.config.from_address;
    const fromName = this.config.smtp_from_name || process.env.SMTP_FROM_NAME || "";

    if (is_debug) {
      log.debug("Send via Nodemailer:", { host, port, toAddresses, ccAddresses, bccAddresses, mail_title });
    }

    log.info("[MailService] Nodemailer 送信開始", {
      host,
      port,
      to: toAddresses,
      cc: ccAddresses,
      bcc: bccAddresses,
      subject: mail_title,
    });

    const { default: nodemailer } = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      tls: { rejectUnauthorized: false },
    });

    const from = fromName ? `"${fromName}" <${fromAddress}>` : fromAddress;

    const info = await transporter.sendMail({
      from,
      to: toAddresses,
      cc: ccAddresses.length > 0 ? ccAddresses : undefined,
      bcc: bccAddresses.length > 0 ? bccAddresses : undefined,
      subject: mail_title,
      text: mail_text,
      attachments: this._normalizeAttachmentsForNodemailer(attachments),
    });

    log.debug("sendMail OK (Nodemailer):", info);

    // SES 互換の戻り値（ComMailLogic 等が result.MessageId を参照）
    return {
      MessageId: info.messageId,
      messageId: info.messageId,
      response: info.response,
    };
  }

  async init() {
    if (!sesClient) {
      sesClient = new SESv2Client({
        region: this.config.region_code,
        credentials: {
          accessKeyId: this.config.cred_key,
          secretAccessKey: this.config.secret_key,
        },
      });
    }

    if (!sqsClient) {
      sqsClient = new SQSClient({
        region: this.config.region_code,
        credentials: {
          accessKeyId: this.config.cred_key,
          secretAccessKey: this.config.secret_key,
        },
      });
    }
  }

  // ---------------------------------------------------------
  // メール送信（デフォルト: AWS SES / Nodemailer=true で SMTP）
  // ---------------------------------------------------------
  async sendMail({
    mailTo = [],
    mailCc = [],
    mailBcc = [],
    mail_title,
    mail_text,
    attachments = [],
    is_debug = false,
    Nodemailer,
  }) {
    if (this._resolveUseNodemailer(Nodemailer)) {
      return this._sendMailViaNodemailer({
        mailTo,
        mailCc,
        mailBcc,
        mail_title,
        mail_text,
        attachments,
        is_debug,
      });
    }

    await this.init();

    if (is_debug) {
      log.debug("Send Props:", { mailTo, mail_title });
    }

    const toAddresses = Array.isArray(mailTo) ? mailTo : [mailTo];
    const ccAddresses = Array.isArray(mailCc) ? mailCc : [mailCc];
    const bccAddresses = Array.isArray(mailBcc) ? mailBcc : [mailBcc];

    try {
      // ============================
      // 添付なし（Simple送信）
      // ============================
      if (!attachments || attachments.length === 0) {
        const command = new SendEmailCommand({
          FromEmailAddress: this.config.from_address,
          Destination: {
            ToAddresses: toAddresses,
            CcAddresses: ccAddresses,
            BccAddresses: bccAddresses,
          },
          Content: {
            Simple: {
              Subject: {
                Data: mail_title,
                Charset: "UTF-8",
              },
              Body: {
                Text: {
                  Data: mail_text,
                  Charset: "UTF-8",
                },
              },
            },
          },
        });

        const result = await sesClient.send(command);
        log.debug("sendMail OK:", result);
        return result;
      }

      // ============================
      // 添付あり → Rawメール作成
      // ============================

      const boundary = "NextPart_" + Date.now();

      let rawMessage =
        `From: ${this.config.from_address}\n` +
        `To: ${toAddresses.join(",")}\n` +
        `Subject: ${mail_title}\n` +
        `MIME-Version: 1.0\n` +
        `Content-Type: multipart/mixed; boundary="${boundary}"\n\n` +
        `--${boundary}\n` +
        `Content-Type: text/plain; charset="UTF-8"\n\n` +
        `${mail_text}\n\n`;

      for (const file of attachments) {
        const base64Content = Buffer.from(file.content).toString("base64");

        rawMessage +=
          `--${boundary}\n` +
          `Content-Type: ${file.contentType || "application/octet-stream"}; name="${file.filename}"\n` +
          `Content-Transfer-Encoding: base64\n` +
          `Content-Disposition: attachment; filename="${file.filename}"\n\n` +
          `${base64Content}\n\n`;
      }

      rawMessage += `--${boundary}--`;

      const command = new SendEmailCommand({
        FromEmailAddress: this.config.from_address,
        Destination: {
          ToAddresses: toAddresses,
          CcAddresses: ccAddresses,
          BccAddresses: bccAddresses,
        },
        Content: {
          Raw: {
            Data: Buffer.from(rawMessage),
          },
        },
      });

      const result = await sesClient.send(command);
      log.debug("sendMail OK (Raw):", result);
      return result;
    } catch (err) {
      log.error("sendMail Error:", err);
      throw err;
    }
  }

  // ---------------------------------------------------------------------------
  // メール送信結果取得
  // SQSよりメール送信履歴を取得、チェック履歴テーブルに保存
  // Nodemailer モードでは SQS を使用しない（空配列を返す）
  // ---------------------------------------------------------------------------
  async checkData(option = {}, after_func, is_debug = false) {
    if (this._resolveUseNodemailer(option.Nodemailer)) {
      if (is_debug) {
        log.debug("checkData skipped (Nodemailer mode)");
      }
      return [];
    }

    if (is_debug) {
      log.debug("Send Mail Props :", { option, after_func });
    }
    await this.init();
    log.debug("===== checkData ======");

    try {
      const defaultParams = {
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 20,
      };

      const params = {
        ...defaultParams,
        ...option,
        QueueUrl: this.config.queue_url,
      };

      const command = new ReceiveMessageCommand(params);
      const messages = await sqsClient.send(command);

      const results = [];

      if (!messages.Messages || messages.Messages.length <= 0) {
        log.debug("SQS: メッセージなし");
        return results;
      }

      for (const msg of messages.Messages) {
        try {
          const body = JSON.parse(msg.Body);
          let message;

          if (typeof body.Message === "string" && body.Message.trim().startsWith("{")) {
            message = JSON.parse(body.Message);
          } else {
            log.warn("body.Message は JSON 形式ではない:", body.Message);
            continue;
          }

          const notificationType = message?.notificationType || "";
          const messageId = message.mail?.messageId || "";
          log.debug(`通知タイプ: ${notificationType}`);

          let recipients = [];

          // ===== Bounce =====
          if (notificationType === "Bounce") {
            recipients = message?.bounce?.bouncedRecipients?.map((r) => r.emailAddress) || [];
          }

          // ===== Delivery =====
          if (notificationType === "Delivery") {
            recipients = message?.delivery?.recipients || [];
          }

          // ===== Complaint =====
          if (notificationType === "Complaint") {
            recipients = message?.complaint?.complainedRecipients?.map((r) => r.emailAddress) || [];
          }

          const sendTime =
            notificationType === "Bounce"
              ? message.bounce.timestamp
              : notificationType === "Complaint"
                ? message.complaint.timestamp
                : notificationType === "Delivery"
                  ? message.delivery.timestamp
                  : "";

          const status =
            notificationType === "Delivery" ? "OK" : ["Bounce", "Complaint"].includes(notificationType) ? "NG" : "UNKNOWN";

          // ===== 受信者ごとに処理 =====
          for (const mailTo of recipients) {
            log.debug(`SES結果: ${mailTo} → ${status}`);

            if (typeof after_func === "function") {
              await after_func({
                messageId,
                mailTo,
                sendTime,
                status,
                notificationType,
              });
            }

            results.push({
              notificationType,
              mailTo,
              messageId,
              status,
            });
          }
          // ===== SQS削除 =====
          if (option.deleteMessage !== false) {
            const deleteCommand = new DeleteMessageCommand({
              QueueUrl: this.config.queue_url,
              ReceiptHandle: msg.ReceiptHandle,
            });
            await sqsClient.send(deleteCommand);
            log.info("SQS: メッセージ削除完了");
          } else {
            log.info("SQS: メッセージ削除スキップ（option.deleteMessage = false）");
          }
        } catch (e) {
          log.warn("メッセージ処理中にエラー:", e);
        }
      }

      return results;
    } catch (err) {
      log.error("SQS処理エラー:", err);
    }
  }
}

// サーバーサイドでのみ実行されることを確認
if (typeof window !== "undefined") {
  throw new Error("MailServiceはサーバーサイドでのみ使用可能です");
}

export default MailService;
