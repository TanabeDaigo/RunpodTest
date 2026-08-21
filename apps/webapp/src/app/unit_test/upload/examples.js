"use client";

// switchの使用例
export const uploadExample = `// configの設定
// packages\common\src\config\config.js
// ASES・ASQS・S3の設定
  amazon: {
    Metrojs: {
      region_code: process.env.ASES_REGION_CODE,
      cred_key: process.env.ASES_CREDENTIAL_ACCESS_KEY,
      secret_key: process.env.ASES_CREDENTIAL_SECRET_KEY,
      from_address: process.env.ASES_FROM_ADDRESS,
      queue_url: process.env.SQS_QUEUE_URL,
      bucket_name: process.env.S3_BUCKET_NAME,
      expires: 60 * 5 , // 5分間
      timeout: 10000 , // 10秒
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

  # S3接続情報
S3_BUCKET_NAME=/* S3のバケット名 */
`;

{/* テストケース */}
export const uploadTest1 = `{/* テスト1 uploadの基本的なAPI例 */}
async uploadToS3(req, dbjs) {
  const s3Service = new S3Service(config.amazon.Metrojs);
  const params = this.params;

  for (const file of params.files) {
    const { name, type, text, isBase64 } = file;

    const buffer = await s3Service.getBuffer({
      text,
      type,
      isBase64,
    });

    const timestamp = dayjs().format("YYYYMMDD_HHmmss");
    const safeFileName = await s3Service.getSafeFileName(\`\${timestamp}_\${name}\`);

    await s3Service.uploadFile({
      key: \`upload/\${safeFileName}\`,
      body: buffer,
      contentType: type,
    });
  }

  return { success: true };
}`;

export const uploadTest1Example = `{/* テスト1 uploadの基本的な使用例 */}
const handleUpload = async (files) => {
    const previews = [];

    for (const file of files) {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (file.type.startsWith("text") || file.name.endsWith(".csv")) {
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result);
        } else {
          reader.readAsArrayBuffer(file);
          reader.onload = () => resolve(Buffer.from(reader.result).toString("base64"));
        }

        reader.onerror = reject;
      });
      const isBase64 = !file.type.startsWith("text") && file.type !== "";

      previews.push({
        name: file.name,
        type: file.type,
        text,
        isBase64,
      });
    }

    try {
      const res = await api.post({
        mode: "uploadToS3",
        files: previews,
      });

      if (!res.success) {
        alert(res.message || "アップロードに失敗しました");
        return;
      }

      console.log("アップロード成功:", res.uploaded);

      setUploadedFiles((prev) => [...prev, ...res.uploaded]);

    } catch (err) {
      console.error("エラー:", err);
    }
  };`;

export const uploadTest2 = `{/* テスト2 - uploadファイルをメールに添付する使用例 */}
async downloadSelectedAsTarGz(req, dbjs) {
    const s3Service = new S3Service(config.amazon.Metrojs);
    const compress = new Compress();
    const params = this.params;
  
    try {
      // S3からファイルを取得し、圧縮対象の配列を構築
      const files = await Promise.all(
        params.files.map(async (key) => {
          const obj = await s3Service.getFileObject(key);
          return {
            name: key.split("/").pop(),
            content: Buffer.isBuffer(obj.Body)
              ? obj.Body
              : Buffer.from(new Uint8Array(obj.Body)),
          };
        })
      );
      const validFiles = files.filter(f => f !== null);

      if (validFiles.length === 0) {
        return {
          success: false,
          message: "ダウンロード対象ファイルが取得できませんでした",
        };
      }
  
      // 圧縮処理（base64形式で受け取る）
      const base64TarGz = await compress.toTarGzBase64(files);
  
      return {
        success: true,
        filename: "files.tar.gz",
        buffer: base64TarGz,
      };
    } catch (err) {
      log.error("TAR.GZ圧縮ダウンロード失敗:", err);
      return {
        success: false,
        message: "ダウンロード失敗",
        error: err.message,
      };
    }
    
  }

async sendSelectedFilesByMail(req, dbjs) {
  const s3Service = new S3Service(config.amazon.Metrojs);
  const mailService = new MailService(config.amazon.Metrojs);
  const compress = new Compress();
  const params = this.params;

  const files = await Promise.all(
    params.files.map(key => s3Service.getFileObject(key))
  );

  const base64 = await compress.toTarGzBase64(files);
  const buffer = Buffer.from(base64, "base64");

  const mailParams = {
    mailTo: params.mailTo,
    mail_title: params.mail_title,
    mail_text: params.mail_text,
    attachments: [
      {
        filename: params.attachmentName,
        content: buffer,
        contentType: "application/gzip",
      },
    ],
  };

  await mailService.sendMail(mailParams);
}`;

export const uploadTest2Example1 = `{/* テスト1 downloadの基本的な使用例 */}
const handleBatchDownload = async () => {
  const selectedKeys = uploadedFiles
    .filter((file) => selectedFiles[file.url])
    .map((file) => file.s3Key);

  if (selectedKeys.length === 0) {
    alert("ファイルが選択されていません");
    return;
  }

  try {
    const res = await api.post({
      mode: "downloadSelectedAsTarGz",
      files: selectedKeys,
    });

    if (!res.success) {
      alert(res.message || "ダウンロードに失敗しました");
      return;
    }

    const blob = new Blob([Uint8Array.from(atob(res.buffer), c => c.charCodeAt(0))], {
      type: "application/gzip",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.filename || "files.gz";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("バッチダウンロードエラー:", err);
  }
};`;

export const uploadTest2Example2 = `{/* テスト1 downloadの基本的な使用例 */}
const handleSendSelectedFilesByMail = async () => {
    const selectedKeys = uploadedFiles
      .filter((file) => selectedFiles[file.url])
      .map((file) => file.s3Key);
  
    if (selectedKeys.length === 0) {
      alert("ファイルが選択されていません");
      return;
    }
  
    try {
      const res = await api.post({
        mode: "sendSelectedFilesByMail",
        files: selectedKeys,
        mailTo: "tdaigo56@gmail.com",
        mailCc: "",
        mailBcc: "",
        mail_title: "mailTitle",
        mail_text: "mailText",
        attachmentName: "selected_files.tar.gz",
      });
  
      if (!res.success) {
        alert(res.message || "メール送信に失敗しました");
        return;
      }
  
      alert("メール送信に成功しました。メッセージID: " + res.messageId);
    } catch (err) {
      console.error("メール送信エラー:", err);
      alert("メール送信中にエラーが発生しました");
    }
  };`;