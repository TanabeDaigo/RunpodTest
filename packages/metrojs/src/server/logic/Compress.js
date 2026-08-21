/**
 * KronoMetro
 * Compress Utility
 */
import tar from "tar-stream";
import zlib from "zlib";
import logjs from "@metrojs/logjs";

const log = new logjs("Compress");

class Compress {
  /**
   * 複数ファイル（Buffer）を tar.gz 形式に圧縮して base64 で返す
   * @param {Array<{ name: string, content: Buffer }>} files 
   * @returns {Promise<string>} base64エンコードされた tar.gz
   */
  async toTarGzBase64(files) {
    const pack = tar.pack();
    const chunks = [];
    const gzip = zlib.createGzip();

    pack.pipe(gzip);

    gzip.on("data", (chunk) => chunks.push(chunk));
    gzip.on("error", (err) => {
      log.error("gzip圧縮エラー", err);
      throw err;
    });

    for (const file of files) {
      log.debug(`--- ファイル追加: ${file.name} (${file.content.length} bytes)`);

      await new Promise((resolve, reject) => {
        pack.entry({ name: file.name }, file.content, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      log.debug(`--- entry完了: ${file.name}`);
    }

    pack.finalize();

    const gzipBuffer = await new Promise((resolve, reject) => {
      gzip.on("end", () => resolve(Buffer.concat(chunks)));
      gzip.on("error", reject);
    });

    return gzipBuffer.toString("base64");
  }

  /**
   * 複数のテキストファイルを連結して gzip 圧縮（base64返し）
   * @param {Array<{ name: string, content: string }>} files 
   * @returns {Promise<string>} base64エンコードされた gzip
   */
  async toGzipBase64(files) {
    const combinedText = files
      .map(file => `\n===== ${file.name} =====\n${file.content}`)
      .join("\n");

    const gzipBuffer = await new Promise((resolve, reject) => {
      zlib.gzip(combinedText, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    return gzipBuffer.toString("base64");
  }
}

export default Compress;