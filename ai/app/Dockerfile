FROM python:3.10-slim

WORKDIR /app

# 필수 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    build-essential \
    git \
    libgomp1 \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir \
    basic-pitch==0.2.6 \
    -r requirements.txt

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (로그 버퍼링 해제)
ENV PYTHONUNBUFFERED=1 \
    PYTHONVERBOSE=1

# 서버 실행
CMD ["uvicorn", "main:app", \
    "--host", "0.0.0.0", \
    "--port", "8000", \
    "--log-level", "debug", \
    "--proxy-headers", \
    "--reload"]
