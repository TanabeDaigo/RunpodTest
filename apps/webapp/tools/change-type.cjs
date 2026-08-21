// change-type.js
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

// コマンドライン引数から新しいtypeを取得
const newType = process.argv[2];

if (newType) {
  packageJson.type = newType;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`package.jsonのtypeフィールドを${newType}に変更しました。`);
} else {
  console.log('新しいtypeを指定してください。');
}