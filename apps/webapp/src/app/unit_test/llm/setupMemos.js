/**
 * セットアップ・実施メモ
 * インストール手順・PowerShell 操作・実対話ログを残す場所。
 * 実装コードとは分けて、あとから見返せるようにする。
 */

export const STEP1_SETUP_MEMO = `
● Llama3 と会話する

【PowerShell】対話シェルで直接話す

ollama run llama3:8b


【モデル取得】

PS> ollama pull llama3:8b
pulling manifest
pulling 6a0746a1ec1a: 100% ... 4.7 GB
...
verifying sha256 digest
writing manifest
success

PS> ollama list
NAME         ID              SIZE      MODIFIED
llama3:8b    365c0bd3c000    4.7 GB    35 seconds ago

PS> ollama run llama3:8b
>>> こんにちは
こんにちは！(Konnichiwa!) 😊 How are you today?

>>> 今日は何日ですか？
As a computer program, I don't have a sense of time or date.
I'm always "online" and ready to chat! ...

>>> 日本で一番高い山は？
In Japan, the highest mountain is Mount Fuji,
which stands at an elevation of 3,776 meters ...


【学び】
・LLM 単体では現在日時などのリアルタイム情報は持っていない
・富士山など一般知識は答えられることがある（ただし数値ミス＝ハルシネーションもあり得る）
・PowerShell の ollama run は対話シェル。アプリからは同じモデルを HTTP API で呼ぶ


【アプリ側（Step1 UI）】
・画面: /unit_test/llm → Step 1
・API: POST /api/llm  mode=chat
・日本語回答: System Prompt に「必ず日本語で回答してください」等を指定
・関連コード:
  - packages/metrojs/src/server/service/OllamaService.js
  - apps/webapp/src/server/controller/LlmController.js
  - apps/webapp/src/app/unit_test/llm/steps/Step1Panel.js
`;

export const STEP2_SETUP_MEMO = `
● Embedding（nomic-embed-text）を使う

【PowerShell】埋め込みモデル取得

PS> ollama pull nomic-embed-text
pulling manifest
...
success

PS> ollama list
NAME                 ID     SIZE      MODIFIED
llama3:8b            ...    4.7 GB    ...
nomic-embed-text     ...    ~274 MB   ...


【API 素振り（PowerShell 例）】

# テキスト → ベクトル（768次元）
Invoke-RestMethod -Uri http://127.0.0.1:11434/api/embed -Method Post -ContentType "application/json" -Body (@{
  model = "nomic-embed-text"
  input = "日本で一番高い山は？"
} | ConvertTo-Json)


【学び】
・llama3（文章生成）と nomic-embed-text（埋め込み）は別モデル
・Embedding は文章を書かない。float 配列（ベクトル）を返す
・似た意味の文はベクトルが近く、Cosine Similarity が高くなる
・まだ Qdrant には保存していない（Step3 以降）


【アプリ側（Step2 UI）】
・画面: /unit_test/llm → Step 2
・API: mode=embed / mode=compareEmbeddings
・環境変数: OLLAMA_EMBED_MODEL=nomic-embed-text
・関連コード:
  - OllamaService.embeddings / compareEmbeddings
  - LlmController.embed / compareEmbeddings
  - apps/webapp/src/app/unit_test/llm/steps/Step2Panel.js
`;

export const STEP3_SETUP_MEMO = `
● Qdrant を Docker で起動する

【前提】Docker Desktop をインストール（当初未導入だった）

1. Docker Desktop for Windows をインストール
   https://www.docker.com/products/docker-desktop/

2. インストール後、PC を再起動し Docker Desktop を起動（Running）
   （初回は WSL2 の有効化を求められることがある）
   ※ Docker Desktop の UI は英語のみ（日本語設定なし）
   ※ 日本語の操作説明: https://docs.docker.jp/desktop/windows/


【つまずき】docker コマンドが見つからない

インストール直後、Cursor の古いターミナルでは:

PS> docker --version
docker : 用語 'docker' は認識されません...（CommandNotFoundException）

原因:
・Docker Desktop は Running でも、開いたままの PowerShell は古い PATH のまま
・CLI 実体: C:\\Users\\tdaig\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe
・User PATH には登録済みだが、ターミナル再起動が必要

対処: ターミナル（または Cursor）を閉じて開き直す


【実際に確認できた出力】2026/07/22

PS C:\\Windows\\system32> docker --version
Docker version 29.6.2, build dfc4efb

PS C:\\Windows\\system32> docker ps
CONTAINER ID   IMAGE                  COMMAND             CREATED          STATUS          PORTS                                                             NAMES
bcfd3e0daba7   qdrant/qdrant:latest   "./entrypoint.sh"   29 minutes ago   Up 29 minutes   0.0.0.0:6333-6334->6333-6334/tcp, [::]:6333-6334->6333-6334/tcp   qdrant


【Qdrant 起動手順（実施済み）】

# リポジトリの compose（データ永続化あり）
PS> cd C:\\Work\\Metrojs\\metrojs
PS> docker compose -f docker-compose.qdrant.yml up -d
# → Image qdrant/qdrant:latest Pulled
# → Container qdrant Started

# または単発
# docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant

ブラウザ: http://localhost:6333/dashboard


【アプリ起動】

PS> cd C:\\Work\\Metrojs\\metrojs
PS> pnpm run dev
# → webapp Local: http://localhost:3000
# → config に ollama / qdrant が載っていることをログで確認


【Step3 UI で実施したこと】2026/07/22（成功）

画面: /unit_test/llm → Step 3

1. mode=checkQdrant
   POST /api/llm 200（疎通 OK）

2. mode=listCollections
   POST /api/llm 200（当初は空）

3. mode=ensureCollection  vectorSize=768  distance=Cosine
   [QdrantService] create collection
   { collection: 'metrojs_rag_docs', size: 768, distance: 'Cosine' }
   POST /api/llm 200
   → Collection「metrojs_rag_docs」作成

4. mode=upsertTestPoint
   text: 「富士山の標高は3776メートルです。」  id: 1
   [OllamaService] embeddings { model: 'nomic-embed-text', length: 18 }
   POST /api/llm 200（約 425ms）
   → Embedding → Point 1件保存まで成功


【学び】
・Qdrant = Vector DB。Embedding したベクトルの保存先
・Collection = 箱（次元 768 / Cosine を nomic-embed-text に合わせる）
・Point = 1件（vector + payload に原文）
・Docker Desktop Running ≠ そのターミナルで docker が使える（PATH 再読込が必要）
・Step2（Embedding）と Step3（保存）がつながると、RAG の土台になる


【アプリ側】
・画面: /unit_test/llm → Step 3
・API: checkQdrant / listCollections / ensureCollection / upsertTestPoint
・環境変数: QDRANT_URL / QDRANT_COLLECTION / QDRANT_VECTOR_SIZE
・関連:
  - packages/metrojs/src/server/service/QdrantService.js
  - docker-compose.qdrant.yml
  - apps/webapp/src/app/unit_test/llm/steps/Step3Panel.js
`;

export const STEP4_SETUP_MEMO = `
● PDF を読み込む（テキスト抽出）

【依存ライブラリ】
packages/metrojs に pdf-parse（v2 PDFParse）を追加済み


【準備】
・検証用に「文字選択できる」短い日本語 PDF を用意する
・スキャン画像のみの PDF はテキストが空になる（OCR 未対応）


【アプリ側（Step4 UI）】
1. /unit_test/llm → Step 4
2. 「PDF を選択」でファイルを選ぶ
3. ページ数・文字数・ページ別テキストを確認
4. document 形（source + pages）が Step5 への受け渡しイメージ


【API】
POST /api/llm
{
  mode: "parsePdf",
  filename: "xxx.pdf",
  contentBase64: "..."
}

成功時の主な戻り値:
・numpages / charCount / text / textPreview
・pages: [{ page, text, charCount }]
・document: { source, pages, text }  ← Step5 入力イメージ
・warning（テキスト空・空ページがある場合）


【学び】
・DocumentLoader = ファイル種別ごとに文書を読む部品の考え方
・LLM に渡す前に「プレーンテキスト化」が必要
・ページ番号は後で Payload に残すと Retrieval 時に便利
・画面で読めても抽出できない PDF がある
  （CID フォント + ToUnicode なし。ReportLab の日本語 PDF に多い）
・対処: 文字コピーできる PDF に作り直す / 検証用 PDF を使う / 将来 OCR


【実際に起きたこと】社内業務マニュアル.pdf
・30ページ / ReportLab 生成 / HeiseiKakuGo-W5（CID）
・ToUnicode なし → pdf-parse では全ページ text 空
・アプリのバグではなく、PDF 側が「表示用の字形コード」しか持っていない


【関連コード】
・packages/metrojs/src/server/service/PdfService.js
・LlmController.parsePdf
・apps/webapp/src/app/unit_test/llm/steps/Step4Panel.js
`;

export const STEP5_SETUP_MEMO = `
● Chunking（テキスト分割）

【目的】
長いテキストを Embedding / 検索向きの短さに分割する。
LangChain の RecursiveCharacterTextSplitter 相当を自前実装。


【デフォルトパラメータ】
・chunkSize = 500（画面初期サンプルは確認しやすいよう 120）
・chunkOverlap = 80（画面初期サンプルは 30）
・区切り優先: \\n\\n → \\n → 。 → ． → ！ → ？ → 、 → 空白 → 文字


【アプリ側（Step5 UI）】
1. /unit_test/llm → Step 5
2. テキストを入力（サンプルあり）
3. size / overlap をスライダーで変更
4. 「Chunking 実行」
5. 件数・各 chunk の文字数・overlap の見え方を確認


【API】
POST /api/llm
{
  mode: "chunkText",
  source: "sample_manual.txt",
  text: "...",
  chunkSize: 120,
  chunkOverlap: 30
}

// または Step4 相当
{
  mode: "chunkText",
  source: "xxx.pdf",
  pages: [{ page: 1, text: "..." }, { page: 2, text: "..." }],
  chunkSize: 500,
  chunkOverlap: 80
}


【学び】
・分割は検索精度のための前処理
・overlap は切れ目の文脈欠落を防ぐ
・chunk には source / page を付けて Step6 の payload に引き継ぐ
・最適サイズは文書次第。まず動かして感覚を掴む


【関連コード】
・packages/metrojs/src/server/service/ChunkService.js
・LlmController.chunkText
・apps/webapp/src/app/unit_test/llm/steps/Step5Panel.js
`;

export const STEP6_SETUP_MEMO = `
● Indexing（Chunk → Embedding → Qdrant）

【前提】
・Ollama 起動 + nomic-embed-text 取得済み（Step2）
・Qdrant 起動 + Collection 作成済み（Step3）
・Chunking の感覚は Step5 で確認済み


【アプリ側（Step6 UI）】
1. /unit_test/llm → Step 6
2. 入力モード: テキスト or PDF
3. size / overlap / replace を設定
4. 「Indexing 実行」
5. upsert 件数・page（PDF時）・scroll サンプルを確認


【API: テキスト】
POST /api/llm
{
  mode: "indexChunks",
  source: "sample_manual.txt",
  text: "...",
  chunkSize: 120,
  chunkOverlap: 30,
  replaceSource: true
}

【API: PDF】
POST /api/llm
{
  mode: "indexPdf",
  filename: "社内業務マニュアル.pdf",
  contentBase64: "...",
  source: "社内業務マニュアル.pdf",  // 省略時は filename
  chunkSize: 500,
  chunkOverlap: 80,
  replaceSource: true
}
// 内部: parsePdf → pages[] → indexChunks（payload.page 付き）


【確認ポイント】
・upserted === chunkCount
・payload に text / source / chunkId がある
・PDF 由来なら page が null でない
・同じ source で再実行しても件数が増え続けない（replace ON）


【学び】
・Indexing と Retrieval は別工程。ここまでは「入れた」だけ
・PDF → pages → chunk → vector が文書取り込みの基本形
・Point ID を安定させると再インデックスが扱いやすい


【関連コード】
・LlmController.indexChunks / indexPdf
・PdfService / ChunkService / QdrantService
・apps/webapp/src/app/unit_test/llm/steps/Step6Panel.js
`;

export const STEP7_SETUP_MEMO = `
● Retrieval（質問 → Embedding → TopK 検索）

【前提】
・Step6 で sample_manual.txt などを Indexing 済み
・Ollama（nomic-embed-text）と Qdrant が起動していること


【アプリ側（Step7 UI）】
1. /unit_test/llm → Step 7
2. 質問を入力（サンプルボタンあり）
3. TopK / source フィルタを設定
4. 「Retrieval 実行」
5. score と payload.text を確認


【API】
POST /api/llm
{
  mode: "retrieve",
  query: "パスワードは何日ごとに変更しますか？",
  topK: 3,
  source: "sample_manual.txt",
  scoreThreshold: 0.3   // 任意
}


【試してほしいこと】
・当たり: 「パスワードは何日ごと？」→ パスワード chunk が上位
・当たり: 「富士山の標高は？」→ 富士山 chunk が上位
・外れ: 「今日の天気は？」→ score 低め / 無関係
・TopK を 1 / 5 に変えて件数の変化を見る


【学び】
・Indexing（入れる）と Retrieval（探す）は別工程
・検索に使うのは vector、答えの材料は payload.text
・次の Step8 で hits の text を Prompt Context に載せる


【関連コード】
・packages/metrojs/src/server/service/QdrantService.js（search）
・LlmController.retrieve
・apps/webapp/src/app/unit_test/llm/steps/Step7Panel.js
`;

export const STEP8_SETUP_MEMO = `
● Prompt 組み立て（hits → Context → messages）

【前提】
・Step6 で Indexing 済み
・Step7 の Retrieval が動くこと（内部で再利用）


【アプリ側（Step8 UI）】
1. /unit_test/llm → Step 8
2. 質問 / TopK / source / template を設定
3. 「Prompt 組み立て」
4. hits・promptText・messages[] を確認


【API】
POST /api/llm
{
  mode: "buildRagPrompt",
  query: "パスワードは何日ごとに変更しますか？",
  topK: 3,
  source: "sample_manual.txt",
  template: "strict"   // または "normal"
}


【Template】
・strict: 参考情報だけを根拠。なければ「わからない」
・normal: 参考情報を優先して簡潔に答える


【試してほしいこと】
・当たり質問 → Context に関連 chunk が入る
・外れ質問（天気）→ Context が薄い / 「わからない」指示が効く形
・strict と normal で System 文の違いを見る


【学び】
・Retrieval の成果物は「材料」、Prompt は「LLMへの依頼書」
・Grounding = 根拠（Context）に縛って答えること
・次の Step9 で messages を chat に渡して回答生成


【関連コード】
・LlmController.buildRagPrompt（内部で retrieve）
・apps/webapp/src/app/unit_test/llm/steps/Step8Panel.js
`;

export const STEP9_SETUP_MEMO = `
● RAG 回答（検索 → Prompt → Llama3 生成）

【前提】
・Step6 で Indexing 済み
・Ollama（llama3:8b + nomic-embed-text）起動
・Qdrant 起動


【アプリ側（Step9 UI）】
1. /unit_test/llm → Step 9
2. 質問 / TopK / source / template を設定
3. 「RAG 回答」
4. 回答テキストと根拠 hits を確認（CPU では時間がかかる）


【API】
POST /api/llm
{
  mode: "ragAnswer",
  query: "パスワードは何日ごとに変更しますか？",
  topK: 3,
  source: "sample_manual.txt",
  template: "strict"
}


【試してほしいこと】
・当たり: パスワード → 「90日」など Context に沿った答え
・当たり: 富士山 → 「3776メートル」（Step1 直聞きより安定しやすい）
・外れ: 天気 → strict なら「わからない」寄り
・strict / normal の言い方の差


【学び】
・RAG = 探す + Prompt + 生成 の組み合わせ
・Context があることでハルシネーションを抑えやすい
・次の Step10 は Retrieval 後の並べ直し（Reranking）


【関連コード】
・LlmController.ragAnswer（buildRagPrompt → chat）
・apps/webapp/src/app/unit_test/llm/steps/Step9Panel.js
`;

export const STEP10_SETUP_MEMO = `
● Reranking（候補拡大 → 並べ直し → Context）

【前提】
・Step6 Indexing / Step9 RAG が動くこと
・CPU では candidateK 分の再 Embedding +（任意）生成で時間がかかる


【アプリ側（Step10 UI）】
1. /unit_test/llm → Step 10
2. candidateK（例: 8）/ finalTopN（例: 3）を設定
3. まず「回答生成 OFF」で Before/After だけ見るのも可
4. 「Rerank + RAG 実行」


【API】
POST /api/llm
{
  mode: "ragAnswerWithRerank",
  query: "パスワードは何日ごとに変更しますか？",
  candidateK: 8,
  finalTopN: 3,
  source: "sample_manual.txt",
  template: "strict",
  skipAnswer: false
}


【見どころ】
・comparison: beforeRank / afterRank / rankDelta
・hitsAfter: Context に載った上位
・短いサンプルでは順位が変わらないこともある（それも学び）


【学び】
・Rerank は Retrieval の後工程
・学習用は Embedding 再スコア。本番は専用 reranker が多い
・次は Step11（LangChain で部品を整理）または Step12（組み込み）


【関連コード】
・LlmController.ragAnswerWithRerank
・apps/webapp/src/app/unit_test/llm/steps/Step10Panel.js
`;

export const STEP11_SETUP_MEMO = `
● LangChain で RAG を再構成する

【前提】
・Step6 で Indexing 済み（sample_manual.txt など）
・Ollama（llama3 / nomic-embed-text）と Qdrant が起動していること
・依存: @langchain/core / @langchain/ollama（apps/webapp）


【アプリ側（Step11 UI）】
1. /unit_test/llm → Step 11
2. Step9 と同じ質問・source を入れて「LangChain RAG 実行」
3. 回答と「自前 ↔ LangChain 対応表」を確認
4. 必要なら Step9 と同じ質問で結果を比較


【API】
POST /api/llm
{
  mode: "ragAnswerLangChain",
  query: "パスワードは何日ごとに変更しますか？",
  topK: 3,
  source: "sample_manual.txt",
  template: "strict"
}


【見どころ】
・mapping: 自前クラスと LangChain 部品の対応
・hits / context / messages は Step9 と同系統
・Retriever は QdrantService をラップ（既存 Collection を再利用）


【学び】
・LangChain = パイプラインの標準部品化
・Indexing 経路を変えなくても Retrieval〜生成を載せ替えられる
・次は Step12（社内組み込み: API・権限・運用）※保留
・価格など変動データは Step13（PostgreSQL）


【関連コード】
・apps/webapp/src/server/llm/langchainRag.js
・LlmController.ragAnswerLangChain
・apps/webapp/src/app/unit_test/llm/steps/Step11Panel.js
`;

export const STEP13_SETUP_MEMO = `
● PostgreSQL JSONB 価格連携（Qdrant なし）

【前提】
・ローカルに PostgreSQL インストール済み
・DB: metro_llm
・TABLE: product_catalog（payload JSONB + GIN）
・旧 product_prices は残ってよい（Step13 は使わない）
・env/.env.development に LLM_PG_* を設定（特に LLM_PG_PASSWORD）


【env 例】
LLM_PG_HOST=127.0.0.1
LLM_PG_PORT=5432
LLM_PG_USER=postgres
LLM_PG_PASSWORD=（インストール時のパスワード）
LLM_PG_DATABASE=metro_llm


【アプリ側（Step13 UI）】
1. 開発サーバ再起動（コード・env 反映）
2. /unit_test/llm → Step 13
3. 「JSONB テーブル準備（作成＋シード）」
4. 「価格一覧」で aliases 付きを確認
5. 「林檎の値段は？」「apple の価格は？」→ 180円になること
6. skipAnswer ON で LLM なしでも同じ金額になること


【API】
POST /api/llm  { mode: "checkLlmPostgres" }
POST /api/llm  { mode: "ensureProductCatalogJsonb" }
POST /api/llm  { mode: "listProductPrices" }
POST /api/llm  {
  mode: "answerPriceFromPostgres",
  query: "林檎の値段は？",
  skipAnswer: true
}


【学び】
・リアルタイム寄りの数値 = Postgres JSONB 直読み
・表記ゆれ = aliases（AI なしでも可）
・マニュアル RAG = Qdrant（Step7〜11）


【関連コード】
・apps/webapp/src/server/llm/postgresPrice.js
・LlmController.ensureProductCatalogJsonb / listProductPrices / answerPriceFromPostgres
・apps/webapp/src/app/unit_test/llm/steps/Step13Panel.js
`;

export const STEP14_SETUP_MEMO = `
● 生成モデル切替比較（llama3 / qwen3）

【前提】
ollama pull llama3:8b
ollama pull qwen3:8b
ollama list
# nomic-embed-text は Embedding 用（本 Step のタブ対象外）


【アプリ側（Step14 UI）】
1. /unit_test/llm → Step 14
2. タブで llama3:8b / qwen3:8b を選択
3. 同じ質問をそれぞれ送信
4. 「モデル別の直近回答」で比較


【API】
POST /api/llm
{
  mode: "chat",
  model: "qwen3:8b",
  messages: [
    { role: "system", content: "必ず日本語で答えてください。" },
    { role: "user", content: "日本で一番高い山は？" }
  ]
}


【学び】
・model を変えれば生成モデルを切替できる
・デフォルトは env の OLLAMA_MODEL、リクエスト指定が優先
・日本語の出方・速度を同じ質問で比べる


【関連コード】
・LlmController.chat（既存）
・apps/webapp/src/app/unit_test/llm/steps/Step14Panel.js
`;

export const STEP15_SETUP_MEMO = `
● Tavily Web 検索（最新情報ルート・単体）

【前提】
・Tavily アカウントで API Key を発行
・env/.env.development に設定（サーバ再起動で反映）


【env 例】
TAVILY_API_KEY=tvly-...
TAVILY_SEARCH_DEPTH=basic
TAVILY_MAX_RESULTS=5


【アプリ側（Step15 UI）】
1. /unit_test/llm → Step 15
2. 「Key 確認」
3. サンプル「バレー（昨日）」などで「Tavily で検索」
4. 結果の title / url / content と Context テキストを確認


【API】
POST /api/llm  { mode: "checkTavily" }
POST /api/llm  {
  mode: "tavilySearch",
  query: "昨日のバレーボールの結果は？",
  maxResults: 5,
  searchDepth: "basic",
  expandRelativeDates: true
}


【学び】
・最新情報 = 都度 Web 検索（Qdrant に溜めない）
・Cursor MCP は使わない（アプリは REST + env）
・次の拡張: 検索結果を Ollama に渡して文章化（Step16）


【関連コード】
・apps/webapp/src/server/llm/tavilyClient.js
・LlmController.checkTavily / tavilySearch
・apps/webapp/src/app/unit_test/llm/steps/Step15Panel.js
`;

export const STEP16_SETUP_MEMO = `
● Tavily → Ollama 回答（最新情報ルート）

【前提】
・Step15 と同じく TAVILY_API_KEY 設定済み
・Ollama 起動（例: qwen3:8b）


【アプリ側（Step16 UI）】
1. /unit_test/llm → Step 16
2. サンプル質問を選ぶ（例: 昨日のバレーボールの結果は？）
3. 「検索して回答」
4. 回答本文と出典 URL を確認
5. 必要なら「LLM なし」で検索のみも確認


【API】
POST /api/llm
{
  mode: "answerFromTavily",
  query: "昨日のバレーボールの結果は？",
  model: "qwen3:8b",
  maxResults: 5,
  searchDepth: "basic",
  expandRelativeDates: true,
  skipAnswer: false
}


【学び】
・検索 → Context → 生成、の流れは RAG と同じ型
・違うのは根拠の出所（Web vs Qdrant）
・クレジットは検索のたびに消費される


【関連コード】
・LlmController.answerFromTavily
・apps/webapp/src/app/unit_test/llm/steps/Step16Panel.js
`;

export const STEP17_SETUP_MEMO = `
● Router オーケストレータ（SaaS ask 原型）

【前提】
・Ollama 起動（Router / Main 用チャットモデル）
・internal を試すなら Step6 などで Qdrant に文書を index 済み
・web を試すなら TAVILY_API_KEY（既定）または GEMINI_API_KEY（webProvider=gemini）


【アプリ側（Step17 UI）】
1. /unit_test/llm → Step 17
2. Router / Main モデルを listModels から選択
3. サンプル質問（general / web / internal）で実行
4. route・routeReason・flow・回答を確認
5. forceRoute や scoreThreshold で挙動を固定再現


【API】
POST /api/llm
{
  mode: "orchestrateAsk",
  query: "今日のNVIDIAの株価は？",
  routerModel: "qwen3:8b",
  mainModel: "qwen3:8b",
  tenantId: "demo-tenant",
  scoreThreshold: 0.55,
  routerConfidenceThreshold: 0.6,
  skipAnswer: false,
  webProvider: "tavily"
}

# web を Gemini Grounding → Qwen3 にする場合
# webProvider: "gemini"


【学び】
・分類と生成をモデル役割で分ける
・Context は検索で絞った分だけ Main に渡す
・Router + Vector score の二重判定


【関連コード】
・LlmController.orchestrateAsk → ask/Orchestrator.js
・ask/AiGatewayClient.js（route/embed/generate/web）
・ai-gateway/services/*（共通GPU側）
・apps/webapp/src/server/llm/routeQuestion.js
・apps/webapp/src/app/unit_test/llm/steps/Step17Panel.js
`;

export const STEP18_SETUP_MEMO = `
● tenant_id 隔離（payload / collection）

【前提】
・Qdrant 起動
・Ollama Embedding（nomic-embed-text 等）


【アプリ側（Step18 UI）】
1. /unit_test/llm → Step 18
2. isolationMode を選ぶ（まず payload）
3. 「A/B を index」→ ACME / BETA の有給マニュアルを投入
4. 「同じ質問で A/B retrieve 比較」
5. 隔離 OK チップと、hits 本文が入れ替わることを確認
6. isolationMode=collection でも同様に確認（collection 名が t_acme_docs 等になる）


【API】
POST /api/llm
{
  mode: "indexChunks",
  tenantId: "acme",
  isolationMode: "payload",
  requireTenant: true,
  source: "manual_leave_acme",
  text: "..."
}

POST /api/llm
{
  mode: "retrieve",
  tenantId: "acme",
  isolationMode: "payload",
  requireTenant: true,
  query: "有給の申請方法は？",
  topK: 3
}


【学び】
・tenant 境界は認証で決める（本番では body の tenantId を信じない）
・filter / 専用 collection をサーバ側で必ず付与
・Step17 orchestrateAsk も tenantId 指定時は同じ filter を使う


【関連コード】
・apps/webapp/src/server/llm/tenantScope.js
・LlmController.indexChunks / retrieve / orchestrateAsk
・QdrantService.deleteBySource(tenantId)
・apps/webapp/src/app/unit_test/llm/steps/Step18Panel.js
`;

export const STEP19_SETUP_MEMO = `
● User Memory（PostgreSQL）

【蓄積先】
・DB: 学習ラボ専用 PostgreSQL（例: metro_llm）
・テーブル: llm_chat_messages
・Qdrant / MySQL 本体ではない


【SQL（手動）】
psql -h 127.0.0.1 -U postgres -d metro_llm -f apps/webapp/scripts/sql/llm_chat_messages.sql

-- または UI / API の ensureChatMemoryTable でも作成可


【CREATE TABLE】
CREATE TABLE IF NOT EXISTS llm_chat_messages (
  id            BIGSERIAL PRIMARY KEY,
  tenant_id     TEXT        NOT NULL,
  user_id       TEXT        NOT NULL,
  session_id    TEXT        NOT NULL,
  role          TEXT        NOT NULL
                CHECK (role IN ('user', 'assistant', 'system')),
  content       TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_llm_chat_messages_scope_created
  ON llm_chat_messages (tenant_id, user_id, session_id, created_at DESC);


【アプリ側】
1. /unit_test/llm → Step 19
2. 「テーブルを確保」
3. tenant / user / session を設定
4. サンプル「名前は太郎…」→「名前は何でしたか？」の順で送信
5. session を変えると覚えなくなることを確認


【API】
POST /api/llm { mode: "ensureChatMemoryTable" }
POST /api/llm {
  mode: "orchestrateAsk",
  query: "...",
  forceRoute: "general",
  useMemory: true,
  tenantId: "acme",
  userId: "user-1",
  sessionId: "session-a",
  mainModel: "qwen3:8b"
}


【関連コード】
・apps/webapp/scripts/sql/llm_chat_messages.sql
・apps/webapp/src/server/llm/postgresChatMemory.js
・LlmController.orchestrateAsk（useMemory）
・apps/webapp/src/app/unit_test/llm/steps/Step19Panel.js
`;

export const STEP20_SETUP_MEMO = `
● Gemini（通常 LLM / Google Search Grounding）

【準備】
1. Google AI Studio で API キー発行
2. env/.env.development に設定:

GEMINI_API_KEY=（発行したキー）
GEMINI_LLM_MODEL=gemini-flash-latest
GEMINI_SEARCH_MODEL=gemini-flash-latest

3. 開発サーバ再起動（env 反映）
4. キーをチャットや Git に貼らない。漏洩したら再発行
5. 2.5 は新規キー不可。Lite を試すなら gemini-3.5-flash-lite


【CLI 最小検証】
pnpm --filter webapp gemini:verify
pnpm --filter webapp gemini:verify -- --search
pnpm --filter webapp gemini:verify -- --query "日本で一番高い山は？"


【アプリ】
1. /unit_test/llm → Step 20
2. 「疎通確認」（Flash-Lite / 検索なし）
3. 検索 OFF で「日本で一番高い山は？」
4. 検索 ON で「2026年の最新AIニュースを教えて」
5. Step17 で webProvider=gemini、forceRoute=web → Qwen3 最終回答


【API】
POST /api/llm { mode: "checkGemini" }
POST /api/llm {
  mode: "answerFromGemini",
  query: "日本で一番高い山は？",
  useGoogleSearch: false,
  model: "gemini-flash-latest"
}
POST /api/llm {
  mode: "answerFromGemini",
  query: "今日のNVIDIAの株価は？",
  useGoogleSearch: true,
  model: "gemini-flash-latest"
}
POST /api/llm {
  mode: "orchestrateAsk",
  query: "今日のNVIDIAの株価は？",
  forceRoute: "web",
  webProvider: "gemini",
  mainModel: "qwen3:8b"
}


【関連コード】
・apps/webapp/src/server/llm/geminiClient.js
・apps/webapp/scripts/gemini-verify.mjs
・LlmController.checkGemini / answerFromGemini / orchestrateAsk
・apps/webapp/src/app/unit_test/llm/steps/Step20Panel.js
`;

export const STEP21_SETUP_MEMO = `
● STEP21 RAG / WEB / LLM 統合テスト

【前提】
・Ollama 起動（Router / 回答用チャットモデル）
・Embedding 用モデル（RAG 時・例: nomic-embed-text）
・Qdrant 起動 + 文書インデックス（RAG 用）
・TAVILY_API_KEY（WEB 用）
・ログイン済みセッション（/api/ai/* は auth 必須）


【GPU 疎通（Hello・Ollama 不要）】
1. /unit_test/llm → Step 21 →「GPU疎通（Hello）」
2. 成功時 message=Hello World / mode=in-process
3. HTTP 経路の確認:
   pnpm --filter webapp ai-gateway:stub
   env: AI_GATEWAY_BASE_URL=http://127.0.0.1:3100
   開発サーバ再起動 → 再度 Hello → mode=http
4. RunPod 時は BASE_URL を Endpoint（互換 /v1/hello）に差し替え


【アプリ】
1. /unit_test/llm → Step 21
2. サンプル「RAG」「WEB」「LLM」で forceRoute 付き質問をセット
3. Router / 回答モデルを選択 →「質問する」
4. Router判定 → ステップ進捗 → 回答 を確認


【API】
POST /api/ai/hello
{ "message": "Hello World" }

POST /api/ai/router
{
  "question": "当社の有給休暇について教えて",
  "routerModel": "qwen3:8b"
  // または "forceRoute": "RAG"
}

POST /api/ai/answer
{
  "question": "当社の有給休暇について教えて",
  "route": "RAG",
  "mainModel": "qwen3:8b",
  "tenantId": "demo-tenant"
}


【将来の GPU 分離】
・画面 → Application API（/api/ai/*）→ AiGatewayClient
・AI_GATEWAY_BASE_URL 未設定: in-process（現状）
・設定時: 共通 GPU サーバの HTTP API へ


【関連コード】
・apps/webapp/src/server/ask/step21.js
・apps/webapp/src/app/api/ai/hello/route.js
・apps/webapp/src/app/api/ai/router/route.js
・apps/webapp/src/app/api/ai/answer/route.js
・apps/webapp/src/server/ask/AiGatewayClient.js
・apps/webapp/scripts/ai-gateway-stub.mjs
・apps/webapp/src/app/unit_test/llm/steps/Step21Panel.js
`;
