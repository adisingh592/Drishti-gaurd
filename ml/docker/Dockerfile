FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONPATH=/app

EXPOSE 8001 8501
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8001"]
