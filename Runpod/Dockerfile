FROM ollama/ollama:latest

# Python handler for RunPod Serverless
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip python3-venv curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt
# PEP 668: ollama ベースは externally-managed。venv に入れる
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r /app/requirements.txt

COPY handler.py /app/handler.py
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh \
    && sed -i 's/\r$//' /app/start.sh

ENV PATH="/opt/venv/bin:${PATH}"
ENV OLLAMA_HOST=0.0.0.0:11434
ENV OLLAMA_MODEL=llama3.2:1b
ENV OLLAMA_TIMEOUT_SEC=600

ENTRYPOINT []
CMD ["/app/start.sh"]
