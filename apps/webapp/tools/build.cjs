const gulp = require('gulp');
const { exec } = require('child_process');


const command = `cross-env ENVIRONMENT=development ANALYZE=false IS_STAGING=false tsc --build ../tsconfig.server.json`;

// コマンドを実行するタスクを定義
gulp.task('run-command', (done) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`エラー: ${err}`);
      return done(err);
    }
    console.log(`出力: ${stdout}`);
    console.error(`エラー出力: ${stderr}`);
    done();
  });
});