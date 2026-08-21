/**
 *
 * KronoMetro
 *
 * Copyright © 2025-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import logjs from "@metrojs/logjs";
import { AbstractObject as Abstract } from "@common/server";
import { config } from "@common/config";
import { service } from "@lib/server";

const { MailService } = service;
const log = new logjs("SendtestController");

@injectable()
class SendtestController extends Abstract {
  constructor() {
    super();
    log.debug("SendtestController initialized");
  }
  
  async sendMailTest(req, dbjs) {
    const mailService = new MailService(config.amazon.Metrojs);
    try {
      const params = this.params;
      const mailParams = {
        mailTo: params.mailTo,
        mailCc: params.mailCc || undefined,
        mailBcc: params.mailBcc || undefined,
        mail_title: params.mail_title,
        mail_text: params.mail_text,
        // attachments:[ {
        //   filename: 'data.csv',
        //   content: '名前,年齢\n田中,30',
        //   contentType: 'text/csv',
        // }],
        option: params.option ?? {},
        Nodemailer: true,
      };
      const messageId = await mailService.sendMail(mailParams);

      if (messageId) {
        return {
          success: true,
          message: "メール送信に成功しました",
          messageId: messageId.MessageId,
        };
      } else {
        return {
          success: false,
          message: "メール送信に失敗しました",
        };
      }
    } catch (err) {
      log.error("メール送信中にエラー", err);
      return {
        success: false,
        message: "送信処理で例外が発生しました",
        error: err.message,
      };
    }
  }

  async checkData() {
    const mailService = new MailService(config.amazon.Metrojs);
    const after_func = ({ messageId, mailTo, mailCc, mailBcc, sendTime, status, notificationType }) => {
      log.debug('=== after_func 呼び出し');
      log.debug('メッセージID:', messageId);
      log.debug('宛先(To):', mailTo);
      log.debug('宛先(Cc):', mailCc);
      log.debug('宛先(Bcc):', mailBcc);
      log.debug('送信時間:', sendTime);
      log.debug('ステータス:', status);
      log.debug('通知タイプ:', notificationType);
    };
    try {
      const params = this.params;
      const result = await mailService.checkData(params.option, after_func);
      return {
        success: true,
        message: 'SQS処理が完了しました',
        result,
      };
    } catch (err) {
      return {
        success: false,
        message: 'SQS処理中にエラーが発生しました',
        error: err.message,
      };
    }
  }

  async uploadTest(req, dbjs) {
    const { files } = this.params;
  
    if (!Array.isArray(files) || files.length === 0) {
      return { success: false, message: "ファイルが送信されていません" };
    }
  
    const previews = files.map(file => ({
      name: file.name,
      type: file.type,
      text: file.text,
    }));
  
    return { success: true, preview: previews };
  }

}

export default SendtestController;
