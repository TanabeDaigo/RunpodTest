// 基本的なSESの使用例
export const sendMailExample = `// configの設定
// packages\common\src\config\config.js
// ASES・ASQSの設定
amazon: {
  Metrojs: {
    region_code: process.env.ASES_REGION_CODE,
    cred_key: process.env.ASES_CREDENTIAL_ACCESS_KEY,
    secret_key: process.env.ASES_CREDENTIAL_SECRET_KEY,
    from_address: process.env.ASES_FROM_ADDRESS,
    queue_url: process.env.SQS_QUEUE_URL
  },
  // 追加ユーザがある場合はここに追加
},

  // ※それぞれの環境の詳細を.envに記載
  # ASES接続情報
  ASES_REGION_CODE=/* リージョンコード。例: ap-northeast-1（東京） */
  ASES_CREDENTIAL_ACCESS_KEY=/* AWSアクセスキー */
  ASES_CREDENTIAL_SECRET_KEY=/* AWSシークレットキー */
  ASES_FROM_ADDRESS=/* 送信元メールアドレス。例: example@example.com */

  # ASQS接続情報
  SQS_QUEUE_URL=/* SQSのキューURL。例: https://sqs.ap-northeast-1.amazonaws.com/123456789012/queue-name */
`;

export const sendMailUseExample = `
// 基本的なASES（メール送信）の使用例
  async sendMailTest(req, dbjs) {
      const mailService = new MailService(config.amazon.Metrojs);
      try {
        const params = this.params;
        const mailParams = {
          mailTo: params.mailTo,
          mailCc: params.mailCc,
          mailBcc: params.mailBcc,
          mail_title: params.mail_title,
          mail_text: params.mail_text,
          option: params.option ?? {},
        };
        const messageId = await mailService.sendMail(mailParams);
  
        if (messageId) {
          return {
            success: true,
            message: "メール送信に成功しました",
            messageId,
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
    }`;

    

// 基本的なSQSの使用例
export const sqsExample = `// 基本的なSQSの使用例

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
  }`;
