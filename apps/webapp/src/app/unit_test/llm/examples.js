/**
 * LLM / RAG 学習ラボのロードマップ定義
 * available=true の Step は画面からいつでもテスト可能
 */
export const ROADMAP = [
  {
    step: 1,
    title: "Ollama API を Node.js から呼ぶ",
    available: true,
    summary: "Llama3 への Chat / Generate。System Prompt・ハルシネーションの確認。",
  },
  {
    step: 2,
    title: "Embedding API を呼ぶ",
    available: true,
    summary: "nomic-embed-text でテキスト→ベクトル。類似度の体感。",
  },
  {
    step: 3,
    title: "Docker で Qdrant を起動",
    available: true,
    summary: "Vector DB の起動・Collection 作成・疎通。",
  },
  {
    step: 4,
    title: "PDF を読み込む",
    available: true,
    summary: "DocumentLoader 相当。PDF テキスト抽出。",
  },
  {
    step: 5,
    title: "Chunking",
    available: true,
    summary: "分割サイズ・Overlap・RecursiveCharacterTextSplitter。",
  },
  {
    step: 6,
    title: "Embedding → Qdrant 保存",
    available: true,
    summary: "チャンクをベクトル化して Point として保存。",
  },
  {
    step: 7,
    title: "Retrieval",
    available: true,
    summary: "TopK / Similarity / Metadata Filter。",
  },
  {
    step: 8,
    title: "Prompt 組み立て",
    available: true,
    summary: "検索結果を Context にした Prompt Template。",
  },
  {
    step: 9,
    title: "Llama3 へ渡して回答",
    available: true,
    summary: "RAG 一通り（検索→Prompt→生成）。",
  },
  {
    step: 10,
    title: "Reranking",
    available: true,
    summary: "Retrieval 後の並べ直し（精度向上）。",
  },
  {
    step: 11,
    title: "LangChain で再構成",
    available: true,
    summary: "これまでに書いた処理を LangChain の部品で整理。",
  },
  {
    step: 12,
    title: "社内システムへ組み込み",
    available: false,
    summary: "API 設計・権限・運用を意識した組み込み。（保留）",
  },
  {
    step: 13,
    title: "PostgreSQL 価格連携",
    available: true,
    summary: "変動データは DB 直読み。質問→SELECT→回答（Qdrant なし）。",
  },
  {
    step: 14,
    title: "生成モデル切替比較",
    available: true,
    summary: "タブで llama3 / qwen3 などを切替えて同じ質問を比較。",
  },
  {
    step: 15,
    title: "Tavily Web 検索",
    available: true,
    summary: "最新情報ルート。Tavily で検索結果・出典を取得（Ollama なし単体テスト）。",
  },
  {
    step: 16,
    title: "Tavily → Ollama 回答",
    available: true,
    summary: "Web 検索結果を Context に、Ollama で要約・質問回答（Qdrant なし）。",
  },
  {
    step: 17,
    title: "Router オーケストレータ",
    available: true,
    summary: "Router → internal(RAG) / web(Tavily or Gemini) / general(LLM)。SaaS 向け ask の原型。",
  },
  {
    step: 18,
    title: "tenant_id 隔離",
    available: true,
    summary: "payload.tenant_id filter / 専用 collection。他テナント文書が混ざらないことを確認。",
  },
  {
    step: 19,
    title: "User Memory",
    available: true,
    summary: "PostgreSQL に会話履歴を蓄積。直近 N 件だけ Main に注入（tenant+user+session）。",
  },
  {
    step: 20,
    title: "Gemini Web 検索",
    available: true,
    summary: "gemini-flash-latest（通常 LLM / Google Search Grounding）。Step17 の web にも接続可。",
  },
  {
    step: 21,
    title: "RAG / WEB / LLM 統合テスト",
    available: true,
    summary: "Router API + 回答 API。RAG / WEB / LLM を1画面で確認（GPU 分離前提の API 分割）。",
  },
];

export const STEP1_FLOW = `
[Browser]
   │  api.post({ mode: "chat", messages })
   ▼
[Next.js] /api/llm  →  LlmController.chat
   │
   ▼
[OllamaService]  POST http://127.0.0.1:11434/api/chat
   │
   ▼
[Ollama]  →  Llama3:8b 推論  →  回答テキスト
`;

export const STEP1_CODE = `// サーバー側（OllamaService）
const res = await fetch("http://127.0.0.1:11434/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3:8b",
    messages: [
      // System Prompt: 回答言語・役割を固定する（Prompt Engineering の入口）
      { role: "system", content: "必ず日本語で回答してください。" },
      { role: "user", content: "日本の人口は？" },
    ],
    stream: false,
  }),
});
const data = await res.json();
// data.message.content が回答
`;

export const STEP1_LEARNING_NOTES = `
## Step1 で理解すること

1. PowerShell の \`ollama run\` は対話シェル。
   アプリからは同じモデルを HTTP API で呼ぶ。

2. LLM 単体には「今日の日付」や社内 PDF の知識はない。
   （すでに体験済み: 今日は何日？→分からない）

3. この段階では RAG ではない。
   Embedding / Vector DB / Retrieval はまだ通っていない。

4. 標高などの数値ミスはハルシネーション（モデル知識の誤り）。
   正確さが必要なら後の RAG で外部知識を渡す。
`;

export const STEP2_FLOW = `
[テキスト]
   │
   ▼
OllamaService.embeddings
   │  POST /api/embed
   │  model: nomic-embed-text
   ▼
float[]（例: 768次元）
   │
   ├─ 単体確認: dimensions / preview
   └─ 2文比較: Cosine Similarity
        ※ まだ Qdrant には保存しない（Step3以降）
`;

export const STEP2_CODE = `// Embedding
const res = await fetch("http://127.0.0.1:11434/api/embed", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "nomic-embed-text",
    input: "日本で一番高い山は？",
  }),
});
const data = await res.json();
// data.embeddings[0] がベクトル（float配列）

// Cosine Similarity（似ているほど 1 に近い）
function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
`;

export const STEP2_LEARNING_NOTES = `
## Step2 で理解すること

1. Embedding = テキストを「意味の数値表現」に変換すること。
   生成（文章を書く）ではない。

2. llama3（生成）と nomic-embed-text（埋め込み）は別モデル。

3. Cosine Similarity が高い = 意味が近い、と機械的に判断できる。
   これが後の Vector DB 検索の土台。

4. まだ DB には保存していない。
   Step3 で Qdrant、Step6 で保存、Step7 で Retrieval。
`;

export const STEP3_FLOW = `
Docker Desktop
   │
   ▼
Qdrant コンテナ (:6333)
   │
   ├─ Collection（例: metrojs_rag_docs）
   │     vectors.size = 768
   │     distance = Cosine
   │
   └─ Point（試験用 1件）
         id + vector + payload(原文)
`;

export const STEP3_CODE = `// Collection 作成
await fetch("http://127.0.0.1:6333/collections/metrojs_rag_docs", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    vectors: { size: 768, distance: "Cosine" },
  }),
});

// Point upsert
await fetch("http://127.0.0.1:6333/collections/metrojs_rag_docs/points?wait=true", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    points: [{
      id: 1,
      vector: [/* 768 floats from nomic-embed-text */],
      payload: { text: "富士山の標高は3776メートルです。" },
    }],
  }),
});
`;

export const STEP3_LEARNING_NOTES = `
## Step3 で理解すること

1. Qdrant = ベクトルを保存・検索する DB（Vector DB）

2. Collection ≈ テーブル。同じ次元のベクトルをまとめる箱。
   nomic-embed-text なら size=768、distance=Cosine。

3. Point = 1件。id + vector + payload（原文などの付帯情報）。

4. Docker は「Qdrant を手軽にローカル起動する手段」。
   アプリ本体とは別プロセスで動かす。
`;

export const STEP4_FLOW = `
PDF ファイル（ブラウザで選択）
   │  FileReader → base64
   ▼
POST /api/llm  mode=parsePdf
   │
   ▼
PdfService.parse (pdf-parse / PDFParse)
   │
   ├─ numpages / charCount
   ├─ pages[{ page, text }]
   └─ document（Step5 Chunking への入力形）
`;

export const STEP4_CODE = `import { PDFParse } from "pdf-parse";

const parser = new PDFParse({ data: pdfBuffer });
const info = await parser.getInfo();
const textResult = await parser.getText();
await parser.destroy();

// textResult.pages = [{ num: 1, text: "..." }, ...]
// textResult.text  = 結合テキスト
`;

export const STEP4_LEARNING_NOTES = `
## Step4 で理解すること

1. PDF をそのまま LLM に渡しても、中身を正確に読めるとは限らない。
   明示的にテキスト抽出する（DocumentLoader の役割）。

2. 成果物は「テキスト + メタデータ（ファイル名 / ページ）」。
   これが Step5 Chunking の入力になる。

3. 文字選択できる PDF が対象。
   スキャン画像のみは OCR が別途必要（この Step では未対応）。

4. まだ Embedding / Qdrant 保存はしない。
`;

export const STEP5_FLOW = `
長いテキスト（または Step4 の pages[]）
   │
   ▼
ChunkService.splitDocument
   │  区切り優先: 段落 → 改行 → 。 → 、 → 空白 → 文字
   │  chunkSize / chunkOverlap
   ▼
chunks[
  { id, text, charCount, source, page? }
]
   │
   ▼
Step6 で各 chunk を Embedding → Qdrant
`;

export const STEP5_CODE = `// 概念（実装は ChunkService）
const separators = ["\\n\\n", "\\n", "。", "、", " ", ""];

// 1) 大きい区切りから再帰的に切って chunkSize 以下の片にする
// 2) 片を chunkSize 近くまで詰める
// 3) 次の chunk 先頭に overlap 文字分を重ねる

const result = chunkService.splitDocument({
  source: "manual.txt",
  text: longText,
  chunkSize: 500,
  chunkOverlap: 80,
});
// result.document.chunks → Step6 入力
`;

export const STEP5_LEARNING_NOTES = `
## Step5 で理解すること

1. なぜ分割するか
   長い文書を1ベクトルにすると検索が粗くなる。
   質問に近い「部分」を取り出すため。

2. chunkSize
   小さすぎ → 文脈不足 / 大きすぎ → ノイズ混入。

3. Overlap
   切れ目で文が分断されても、前後の chunk のどちらかに残しやすい。

4. RecursiveCharacterTextSplitter の考え方
   いきなり文字で切らず、段落・改行・句点など自然な境界を優先する。

5. まだ Embedding / Qdrant 保存はしない（Step6）。
`;

export const STEP6_FLOW = `
text または PDF
   │
   ├─ PDF の場合: PdfService.parse → pages[{ page, text }]
   │
   ▼
ChunkService.splitDocument
   │
   ▼
各 chunk → Ollama embeddings（nomic-embed-text）
   │
   ▼
QdrantService
   │  ensureCollection（768 / Cosine）
   │  deleteBySource（replaceSource=true のとき）
   │  upsertPoints（バッチ）
   ▼
Collection に Point が蓄積
   │  payload: { text, source, page, chunkId, ... }
   ▼
Step7 Retrieval の入力になる
`;

export const STEP6_CODE = `// テキスト
await indexChunks({ text, source, chunkSize, chunkOverlap });

// PDF（Step6 UI の PDF モード）
await indexPdf({ filename, contentBase64, source, chunkSize, chunkOverlap });
// 内部: parsePdf → pages[] → indexChunks
// payload.page が付く
`;

export const STEP6_LEARNING_NOTES = `
## Step6 で理解すること

1. Indexing = Chunk → Embedding → Vector DB 保存
   まだ「質問して答える」はしない（それが Step7〜9）。

2. Point = { id, vector, payload }
   検索に使うのは vector。答えの材料は payload.text。

3. source 単位の再インデックス
   同じ文書を何度も入れると重複する。
   replaceSource で旧 Point を消してから入れ直す。

4. Point ID は安定させる
   source + chunkId のハッシュ → 再実行でも同じ ID（upsert で上書き可能）。

5. CPU では Embedding がボトルネック
   chunk 数 × 推論時間。まず短いサンプルで通す。
`;

export const STEP7_FLOW = `
質問テキスト
   │
   ▼
Ollama embeddings（nomic-embed-text）
   │  query vector[768]
   ▼
QdrantService.search
   │  TopK / Cosine
   │  任意: source filter / scoreThreshold
   ▼
hits[
  { rank, score, text, source, chunkId, page? }
]
   │
   ▼
Step8 で Context（Prompt）に載せる
※ この Step ではまだ Llama3 に渡さない
`;

export const STEP7_CODE = `// 概念（実装は LlmController.retrieve）
const { embedding } = await ollama.embeddings({ prompt: query });

const { hits } = await qdrant.search({
  vector: embedding,
  limit: topK,           // 例: 3
  scoreThreshold,        // 任意
  filter: source
    ? { must: [{ key: "source", match: { value: source } }] }
    : undefined,
});

// hits[].payload.text → Step8 の Context
`;

export const STEP7_LEARNING_NOTES = `
## Step7 で理解すること

1. Retrieval = 質問に近い文書片を Vector DB から取ってくる
   まだ「答える」はしない（それが Step8〜9）。

2. Query Embedding も同じモデル
   Indexing と Retrieval で nomic-embed-text を揃える。

3. TopK
   近い順に何件取るか。多すぎるとノイズ、少なすぎると必要情報が欠ける。

4. Score（Cosine）
   大きいほど近い。外れ質問は低めになりがち。

5. Metadata Filter
   source などで検索対象を絞れる（社内文書の切り分けに有用）。
`;

export const STEP8_FLOW = `
質問
   │
   ▼
Retrieval（Step7 と同じ）
   │  hits[{ score, text, source, ... }]
   ▼
Context 整形
   │  [1] (score, source) + text
   │  [2] ...
   ▼
Prompt Template（strict / normal）
   │  System（ルール）
   │  User（参考情報 + 質問）
   ▼
messages[] / promptText
   │
   ▼
Step9 で Llama3 chat に渡す
※ この Step ではまだ生成しない
`;

export const STEP8_CODE = `// 概念（実装は LlmController.buildRagPrompt）
const retrieval = await retrieve({ query, topK, source });
const context = hits.map((h, i) =>
  \`[\${i + 1}] (score=\${h.score}, source=\${h.source})\\n\${h.text}\`
).join("\\n\\n---\\n\\n");

const messages = [
  {
    role: "system",
    content: "参考情報だけを根拠に答える。なければわからない。",
  },
  {
    role: "user",
    content: \`## 参考情報\\n\${context}\\n\\n## 質問\\n\${query}\`,
  },
];
// → Step9: ollama.chat({ messages })
`;

export const STEP8_LEARNING_NOTES = `
## Step8 で理解すること

1. Prompt 組み立て = 検索結果を LLM が使える形にする
   hits の羅列だけでは答えにならない。

2. Context
   ヒットした原文を番号付きで並べた「根拠テキスト」。

3. System Prompt
   役割とルール（例: 根拠外は「わからない」）。

4. Template の違い
   strict → ハルシネーション抑制向き
   normal → 柔軟だが根拠外に寄りやすい

5. まだ生成はしない
   messages を作るまでが Step8。送信は Step9。
`;

export const STEP9_FLOW = `
質問
   │
   ▼
Retrieval（Step7）
   │  hits[]
   ▼
Prompt 組み立て（Step8）
   │  messages[{system,user}]
   ▼
OllamaService.chat（llama3:8b）
   │
   ▼
answer（回答テキスト）
※ Reranking はまだしない（Step10）
`;

export const STEP9_CODE = `// 概念（実装は LlmController.ragAnswer）
const prompt = await buildRagPrompt({ query, topK, source, template: "strict" });

const { content: answer } = await ollama.chat({
  model: "llama3:8b",
  messages: prompt.messages,
});

// answer = Context に基づく回答（strict なら根拠外は「わからない」）
`;

export const STEP9_LEARNING_NOTES = `
## Step9 で理解すること

1. RAG 一通り
   Indexing → Retrieval → Prompt → 生成。ここまでが最小の RAG。

2. Grounded Answer
   Context（参考情報）に基づいて答える。Step1 の直聞きとの違い。

3. strict の効果
   マニュアルにない質問（天気など）は「わからない」になりやすい。

4. 当たり質問
   パスワード / 富士山など、Indexing した内容は根拠付きで答えやすい。

5. まだ Rerank はしない
   TopK の並びをそのまま使う。精度向上は Step10。
`;

export const STEP10_FLOW = `
質問
   │
   ▼
Retrieval（candidateK 件・広め）
   │  hitsBefore[]
   ▼
Rerank
   │  各 hit.text を再 Embedding
   │  質問との Cosine で並べ直し
   ▼
上位 finalTopN 件 → hitsAfter[]
   │
   ▼
Prompt 組み立て →（任意）Llama3 回答
※ 学習用。本番は Cross-Encoder が多い
`;

export const STEP10_CODE = `// 概念（実装は LlmController.ragAnswerWithRerank）
const hitsBefore = await retrieve({ query, topK: candidateK }); // 例: 8

const qVec = await embed(query);
const reranked = [];
for (const h of hitsBefore) {
  const dVec = await embed(h.text);
  reranked.push({ ...h, score: cosine(qVec, dVec) });
}
reranked.sort((a, b) => b.score - a.score);

const hitsAfter = reranked.slice(0, finalTopN); // 例: 3
const messages = buildRagMessages({ query, hits: hitsAfter });
const answer = await chat({ messages });
`;

export const STEP10_LEARNING_NOTES = `
## Step10 で理解すること

1. Reranking = 検索結果の再順位付け
   Retrieval の後工程。粗い候補を丁寧に見直す。

2. candidateK → finalTopN
   まず多めに取り、本当に使うのは上位だけ。

3. 学習用実装
   同一 Embedding + Cosine の再スコア。
   本番では bge-reranker 等の Cross-Encoder が多い。

4. Before / After
   順位が変わらなくてもパイプライン理解が目的。
   短いサンプルでは差が出にくいこともある。

5. Step9 との違い
   Step9 = TopK をそのまま Context
   Step10 = 広げてから絞って Context
`;

export const STEP11_FLOW = `
質問
   │
   ▼
OllamaEmbeddings（LangChain）
   │  query vector
   ▼
MetroQdrantRetriever（BaseRetriever）
   │  QdrantService.search をラップ
   │  Document[]（pageContent + metadata）
   ▼
ChatPromptTemplate
   │  system + 参考情報 + 質問
   ▼
ChatOllama（llama3）
   │
   ▼
回答テキスト

※ Step9 と同じ流れ。部品が LangChain 標準に置き換わるだけ
※ Indexing（Step6）は自前のまま再利用
`;

export const STEP11_CODE = `// 概念（実装: server/llm/langchainRag.js + LlmController.ragAnswerLangChain）
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MetroQdrantRetriever } from "./langchainRag.js";

const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text", baseUrl });
const retriever = new MetroQdrantRetriever({ qdrant, embeddings, topK: 3, source });
const llm = new ChatOllama({ model: "llama3:8b", baseUrl });
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "{system}"],
  ["human", "## 参考情報\\n{context}\\n\\n## 質問\\n{question}"],
]);

const docs = await retriever.invoke(query);
const messages = await prompt.formatMessages({ system, context: formatDocs(docs), question: query });
const ai = await llm.invoke(messages);
// ai.content → 回答
`;

export const STEP11_LEARNING_NOTES = `
## Step11 で理解すること

1. LangChain は魔法ではない
   Embedding → Retrieval → Prompt → 生成は Step9 と同じ。
   標準部品に載せ替えて、差し替えやすくする。

2. 対応関係
   OllamaService.embeddings → OllamaEmbeddings
   QdrantService.search → BaseRetriever（ここでは既存 Qdrant をラップ）
   buildRagMessages → ChatPromptTemplate
   OllamaService.chat → ChatOllama

3. なぜ Retriever を自作ラップしたか
   Step6 で入れた Point / payload 形式をそのまま使うため。
   VectorStore を新規で作り直す必要はない（学習コストを下げる）。

4. Step9 との比較
   同じ質問・同じ source で答えの傾向を比べるとよい。
   文言は毎回少し違うことがある（生成モデルのため）。

5. 次の Step12
   API・権限・マルチテナント・運用を意識した組み込み（保留）。
   Step13 で PostgreSQL 直読みのテストへ。
`;

export const STEP13_FLOW = `
質問「林檎の値段は？」 / 「apple の価格は？」
   │
   ▼
商品名を推定（aliases 含む → 正式名「リンゴ」）
   │
   ▼
PostgreSQL JSONB
  product_catalog
  WHERE payload->>'name' = … OR payload->'aliases' ? …
   │
   ▼
参考情報（価格・別名・更新日時）
   │
   ▼
（任意）LLM が文章化  ※ Qdrant は使わない / skipAnswer なら定型文
   │
   ▼
回答「180円です」など
`;

export const STEP13_CODE = `// 概念（実装: postgresPrice.js + LlmController.answerPriceFromPostgres）
const rows = await pool.query(
  \`SELECT payload->>'name' AS name, payload->>'price_yen' AS price
   FROM product_catalog
   WHERE payload->>'name' = $1 OR payload->'aliases' ? $1\`,
  ["林檎"]
);
const context = formatPriceContext(mapRow(rows.rows[0]));
// skipAnswer=false なら Ollama で文章化（価格は DB の値のみ）
`;

export const STEP13_LEARNING_NOTES = `
## Step13 で理解すること

1. 変動データは PostgreSQL JSONB が正本
   価格のような「今」の値は Qdrant に毎回入れない。

2. 表記ゆれは aliases（JSONB 配列）で解決
   林檎 / りんご / apple → 同じ行の price_yen。

3. 同じ「質問→回答」UIでも裏側は分岐できる
   マニュアル系 = Qdrant RAG（Step9）
   価格系 = Postgres JSONB SELECT（本 Step）

4. LLM の役割
   DB の行を読んで日本語にするだけでもよい（skipAnswer で LLM なしも可）。
   推測で金額を作らせない。

5. 本体 MySQL とは別接続
   LLM_PG_* で metro_llm に繋ぐ。既存 sequelize（MySQL）は触らない。

6. 旧 product_prices（通常列）は参考用
   Step13 の参照先は product_catalog.payload（JSONB）。
`;

export const STEP14_FLOW = `
[Browser] タブで model を選択（例: qwen3:8b / llama3:8b）
   │  api.post({ mode: "chat", model, messages })
   ▼
[LlmController.chat]
   │
   ▼
[OllamaService.chat]  →  選択したモデルで推論
   │
   ▼
回答テキスト（モデル名・所要時間付き）
`;

export const STEP14_CODE = `// UI で選んだ model をそのまま chat に渡す
await api.post({
  mode: "chat",
  model: "qwen3:8b", // または "llama3:8b"
  messages: [
    { role: "system", content: "必ず日本語で答えてください。" },
    { role: "user", content: "日本で一番高い山は？" },
  ],
});
// env の OLLAMA_MODEL は「未指定時のデフォルト」。
// リクエストに model があればそちらが優先される。
`;

export const STEP14_LEARNING_NOTES = `
## Step14 で理解すること

1. 生成モデルは差し替え可能
   llama3:8b と qwen3:8b を同じ API（mode=chat）で比較できる。

2. Embedding は別物
   nomic-embed-text は Chat タブに出さない（ベクトル化専用）。

3. env との関係
   OLLAMA_MODEL はデフォルト。Step14 では画面の選択が優先。

4. 比べる観点
   日本語の自然さ、指示の効き、応答時間、空振りの少なさ。

5. RAG（Step9）でも同じ
   生成モデルだけ変えれば、検索（Qdrant）はそのまま使える。
`;

export const STEP15_FLOW = `
[Browser] 質問入力
   │  api.post({ mode: "tavilySearch", query })
   ▼
[LlmController.tavilySearch]
   │  「昨日」→ JST 日付に展開（任意）
   ▼
[Tavily API] POST https://api.tavily.com/search
   │
   ▼
結果（title / url / content / score）
   │
   ▼
画面表示 ＋ Context テキスト（次に LLM へ渡す材料）
※ 本 Step では Ollama は呼ばない
`;

export const STEP15_CODE = `// 概念（実装: tavilyClient.js + LlmController.tavilySearch）
const searchQuery = expandSearchQuery("昨日のバレーボールの結果は？");
// → 「… 2026年8月2日」など

const data = await fetch("https://api.tavily.com/search", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + process.env.TAVILY_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: searchQuery,
    search_depth: "basic",
    max_results: 5,
  }),
}).then((r) => r.json());

// data.results[] → UI / のちの LLM Context
`;

export const STEP15_LEARNING_NOTES = `
## Step15 で理解すること

1. 最新情報は RAG（Qdrant）ではなく Web 検索
   ローカル LLM 単体では「昨日の試合」は分からない。

2. Tavily = 根拠取得、Ollama = 文章化（次の拡張）
   本 Step は検索単体。Key はサーバ env のみ。

3. 相対日付はアプリで具体化する
   「昨日」→ Asia/Tokyo の年月日をクエリに足す。

4. 出典 URL を必ず残す
   ユーザーが検証できるようにする。

5. 無料枠に注意
   basic 検索はクレジット消費あり。学習画面での連打に注意。

6. 次は Step16
   同じ検索結果を Ollama に渡して要約・回答する。
`;

export const STEP16_FLOW = `
[Browser] 質問
   │  api.post({ mode: "answerFromTavily", query, model })
   ▼
[LlmController.answerFromTavily]
   │  相対日付を展開
   ▼
[Tavily] search → results / Context
   │
   ▼
[Ollama] chat（参考情報のみ・日本語）
   │
   ▼
回答テキスト ＋ 出典 URL
`;

export const STEP16_CODE = `// 概念（実装: tavilyClient + LlmController.answerFromTavily）
const search = await runTavilySearch({ query: expandSearchQuery(question) });
const context = formatTavilyContext(search.results);

await ollama.chat({
  model: "qwen3:8b",
  messages: [
    { role: "system", content: "参考情報だけを根拠に日本語で答える。推測禁止。" },
    { role: "user", content: "## 参考情報\\n" + context + "\\n## 質問\\n" + question },
  ],
});
`;

export const STEP16_LEARNING_NOTES = `
## Step16 で理解すること

1. web ルートの完成形（簡易）
   Tavily = 根拠取得、Ollama = 要約・回答。Qdrant は使わない。

2. Step15 との違い
   Step15 は検索のみ。Step16 は検索＋生成。

3. Step9（RAG）との対比
   RAG は社内文書（Qdrant）。本 Step は公開 Web の最新情報。

4. 幻覚対策
   System で「参考情報以外は推測しない」「日本語のみ」を指示。
   ヒットゼロなら定型の「わからない」。

5. 出典を UI に残す
   LLM の文面だけでなく sources[] を画面表示する。
`;

export const STEP17_FLOW = `
[Browser]
   │  api.post({ mode: "orchestrateAsk", ... })
   ▼
[案件CPU] ask/Orchestrator
   │  AiGatewayClient
   ├─ POST /v1/route     → Router
   ├─ POST /v1/embed     → Embedding（internal時）
   ├─ 案件内 Qdrant 検索
   ├─ POST /v1/web       → Tavily or Gemini（web時）
   └─ POST /v1/generate  → Qwen3
   ▼
answer + flow / routeReason

※ AI_GATEWAY_BASE_URL 未設定時は同一プロセスの ai-gateway を直接呼ぶ
`;

export const STEP17_CODE = `// 案件CPU: Orchestrator が GPU API を分割呼び出し
import { runOrchestrateAsk, createAiGatewayClient } from "../ask/index.js";

const ai = createAiGatewayClient();
const route = await ai.route({ query, routerModel });
if (route.data.route === "internal") {
  const emb = await ai.embed({ text: query });
  // 案件CPU内で Qdrant.search(emb.data.vector)
}
if (route.data.route === "web") {
  await ai.web({ query, provider: "tavily", mode: "context" });
}
await ai.generate({ model: mainModel, messages });

// または一括
await runOrchestrateAsk({ query, routerModel, mainModel, webProvider: "tavily" });
`;

export const STEP17_LEARNING_NOTES = `
## Step17 で理解すること

1. 専用 LLM は持たない
   共通モデル + Router + ルート別 Context で SaaS マルチテナントに近づける。

2. CPU / GPU の境界
   案件CPU: Orchestrator / Qdrant / Memory
   共通GPU: route / embed / generate / web（ai-gateway）

3. Router は分類だけ
   回答品質は Main + 検索で絞った Context。全文を毎回渡さない。

4. Router だけに頼らない
   internal は Vector Search の topScore でも最終判定する。

5. Step9 / 16 / 20 との関係
   部品は既存（RAG / Tavily / Gemini / chat）。本 Step は「つなぐ」ことが主題。
   webProvider=gemini なら Grounding 結果を Context にして Qwen3 が最終回答。

6. tenantId
   Step17 で指定すると internal 検索に filter が付く（Step18 で本格確認）。
`;

export const STEP18_FLOW = `
[Browser]
   │  indexChunks({ tenantId, isolationMode, requireTenant: true, text })
   │  retrieve({ tenantId, query, requireTenant: true })
   ▼
[LlmController]
   │  resolveTenantScope → collection 名 / filter
   │
   ├─ isolation=payload
   │     共有 collection + payload.tenant_id filter
   └─ isolation=collection
         t_{tenant}_docs + それでも payload.tenant_id 付与
   │
   ▼
hits は自テナントのみ（他社マニュアルが混ざらない）
`;

export const STEP18_CODE = `// tenantScope.js
const scope = resolveTenantScope({
  tenantId: "acme",
  isolationMode: "payload", // or "collection"
  defaultCollection: "metrojs_rag_docs",
  requireTenant: true,
});

await indexChunks({
  tenantId: scope.tenantId,
  collection: scope.collection,
  text: "...",
  // payload に tenant_id が付く
});

await qdrant.search({
  collection: scope.collection,
  vector,
  filter: buildQdrantFilter({ tenantId: scope.tenantId }),
});
`;

export const STEP18_LEARNING_NOTES = `
## Step18 で理解すること

1. Router（Step17）は「知識の種類」、tenant は「誰の知識か」
   別レイヤ。混ぜない。

2. payload 方式
   1 collection + filter。運用は楽。filter 忘れが最大リスク → サーバ必須化。

3. collection 方式
   t_acme_docs / t_beta_docs。物理分離しやすい。payload にも tenant_id を残すと二重防御。

4. Point ID
   tenant 付き ID（tenant::source::chunk）で共有 collection でも衝突しない。

5. 受け入れ条件
   同じ質問でも tenant A/B で hits の本文が入れ替わり、他社文書が混ざらない。
`;

export const STEP19_FLOW = `
[Browser]
   │  orchestrateAsk({ useMemory, tenantId, userId, sessionId, query })
   ▼
[PostgreSQL metro_llm]
   │  llm_chat_messages から直近 N 件 SELECT
   ▼
[Main LLM]
   │  system + memory(user/assistant) + 今回の質問
   ▼
回答
   │
   ▼
INSERT user / assistant を同テーブルへ追記
`;

export const STEP19_CODE = `// 蓄積先: PostgreSQL（学習ラボ DB）
// apps/webapp/scripts/sql/llm_chat_messages.sql

const prior = await listChatMemory({
  tenantId: "acme",
  userId: "user-1",
  sessionId: "session-a",
  limit: 12,
});

await ollama.chat({
  model: mainModel,
  messages: [
    { role: "system", content: "..." },
    ...prior.messages.map(({ role, content }) => ({ role, content })),
    { role: "user", content: query },
  ],
});

await appendChatMemory({ role: "user", content: query, ...scope });
await appendChatMemory({ role: "assistant", content: answer, ...scope });
`;

export const STEP19_LEARNING_NOTES = `
## Step19 で理解すること

1. Memory は「続きの会話」、RAG は「社内文書」
   置き場所も違う（PG 履歴 vs Qdrant ベクトル）。

2. 全履歴は渡さない
   直近 N 件だけ Main へ。長くなったら要約は後工程。

3. スコープ
   tenant_id + user_id + session_id。session を変えると文脈が切れる。

4. useMemory OFF
   一問一答に戻る（保存も注入もしない）。

5. 本番
   userId はセッションから。クライアント入力を信じない。
`;

export const STEP20_FLOW = `
STEP1 通常 LLM
[Browser] → answerFromGemini(useGoogleSearch=false)
         → gemini-flash-latest → 回答

STEP2 Google Search Grounding
[Browser] → answerFromGemini(useGoogleSearch=true)
         → gemini-flash-latest + tools.google_search
         → 検索 → 回答 + groundingMetadata

STEP3 Step17 組み込み
Router → web → Gemini Grounding → Context → Qwen3 → 回答
`;

export const STEP20_CODE = `// STEP1: 通常 LLM（Flash-Lite）
await geminiGenerateContent({
  prompt: "日本で一番高い山は？",
  model: "gemini-flash-latest",
  useGoogleSearch: false,
});

// STEP2: Google Search Grounding（Flash）
await geminiGenerateContent({
  prompt: "2026年の最新AIニュースを教えて",
  model: "gemini-flash-latest",
  useGoogleSearch: true,
});
// → answer + groundingMetadata.sources

// CLI 検証
// pnpm --filter webapp gemini:verify
// pnpm --filter webapp gemini:verify -- --search
`;

export const STEP20_LEARNING_NOTES = `
## Step20 で理解すること

1. モデル役割
   gemini-flash-latest（3.x）= 新規キー向け既定。
   2.5 Flash / Flash-Lite は新規ユーザー不可。Lite 候補は gemini-3.5-flash-lite。

2. 無料枠は保証されない
   モデル名・Quota・課金設定で失敗する。エラー文と ai.dev/rate-limit を見る。

3. Tavily との違い
   Tavily = 検索専用 → 別 LLM。
   Gemini Grounding = 検索＋回答一体。Step17 では Context にして Qwen3 にも渡せる。

4. キー管理
   GEMINI_API_KEY はサーバ env のみ。チャットや Git に貼らない。
`;

export const STEP21_FLOW = `
[Browser] 質問入力
   │
   │ POST /api/ai/router  { question }
   ▼
[Router API] → AiGateway.route → RAG | WEB | LLM + reason
   │
   │ 画面に判定結果を表示
   │ POST /api/ai/answer  { question, route }
   ▼
[Answer API]
   ├─ RAG: Embed → Qdrant → Context → Ollama
   ├─ WEB: Tavily → Context → Ollama
   └─ LLM: Ollama のみ
   │
   ▼
画面: ステップ進捗 + 最終回答

※ 画面は Ollama を直接呼ばない（将来 GPU API へ差し替えやすい）
`;

export const STEP21_CODE = `// API① Router（回答しない）
POST /api/ai/router
{ "question": "当社の有給休暇について教えて" }
// → { route: "RAG", reason: "..." }

// API② Answer（指定ルートで生成）
POST /api/ai/answer
{ "question": "当社の有給休暇について教えて", "route": "RAG" }
// → { route: "RAG", answer: "...", steps: [...] }

// デモ用にルート固定
POST /api/ai/router
{ "question": "...", "forceRoute": "WEB" }
`;

export const STEP21_LEARNING_NOTES = `
## Step21 で理解すること

1. API を2つに分ける
   Router と Answer を分離すると、判定結果を先に見せられる。
   将来 GPU サーバへ移すときも同じ境界で差し替えやすい。

2. 画面名と内部名
   UI: RAG / WEB / LLM
   内部: internal / web / general

3. 今回は3択のみ
   RAG+WEB などの複合ルート・Query Planner・Job は対象外。

4. 現在は同一プロセス
   AiGatewayClient は in-process。AI_GATEWAY_BASE_URL を置けば HTTP へ切替。
`;
