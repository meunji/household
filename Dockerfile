FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 포트 노출 (Railway가 동적으로 할당)
EXPOSE 8000

# Railway의 PORT 환경 변수를 사용하도록 쉘 형식으로 실행
# 시작 전 환경 변수 확인 및 오류 출력
CMD ["/bin/sh", "-c", "echo 'Starting application...' && echo 'PORT: '${PORT:-8000} && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
