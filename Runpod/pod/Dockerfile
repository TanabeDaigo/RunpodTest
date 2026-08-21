FROM ollama/ollama:latest

# Node.js 20（MetroJS と同じ JS ランタイム系）
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/pod

COPY package.json /app/pod/package.json
COPY server.mjs /app/pod/server.mjs
COPY start.sh /app/pod/start.sh
RUN chmod +x /app/pod/start.sh \
    && sed -i 's/\r$//' /app/pod/start.sh

ENV OLLAMA_HOST=0.0.0.0:11434
ENV OLLAMA_MODEL=llama3.2:1b
ENV OLLAMA_TIMEOUT_MS=600000
ENV PORT=3100

EXPOSE 3100

ENTRYPOINT []
CMD ["/app/pod/start.sh"]
