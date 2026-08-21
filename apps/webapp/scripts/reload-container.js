import fetch from "node-fetch";

async function reloadContainer() {
  try {
    const response = await fetch("http://localhost:3000/api/reload-container", {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅", result.message);
    } else {
      const error = await response.json();
      console.error("❌", error.error);
    }
  } catch (error) {
    console.error("❌ コンテナ再読み込みに失敗しました:", error.message);
  }
}

reloadContainer();
