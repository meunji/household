# 데이터베이스 연결 문제 해결 가이드

## 문제: `OSError: [Errno 101] Network is unreachable`

WSL2 환경에서 Supabase PostgreSQL에 연결할 때 발생하는 네트워크 오류입니다.

## 해결 방법

### 1. 즉시 시도할 수 있는 방법

#### 방법 A: WSL2 네트워크 재시작 (가장 효과적)

**Windows PowerShell에서 실행:**
```powershell
wsl --shutdown
```

그 후 WSL2를 다시 시작하고 백엔드 서버를 재시작하세요.

#### 방법 B: 연결 테스트 스크립트 실행

```bash
cd /home/meunji/work/cursor/household
python test_db_connection.py
```

이 스크립트는 연결 상태를 확인하고 문제를 진단합니다.

### 2. Windows 방화벽 확인

1. Windows 설정 → 개인 정보 보호 및 보안 → Windows 보안
2. 방화벽 및 네트워크 보호
3. 고급 설정
4. 아웃바운드 규칙 확인
5. PostgreSQL 포트(5432)가 차단되지 않았는지 확인

### 3. VPN 확인

VPN을 사용 중이라면:
- 일시적으로 VPN을 비활성화
- 연결 테스트 후 다시 활성화
- VPN이 WSL2 네트워크를 방해할 수 있습니다

### 4. 네트워크 어댑터 확인

**Windows PowerShell에서 실행:**
```powershell
Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*WSL*"}
```

WSL 네트워크 어댑터가 비활성화되어 있다면 활성화하세요.

### 5. DNS 확인

WSL2에서 DNS 설정 확인:
```bash
cat /etc/resolv.conf
```

DNS 서버가 올바르게 설정되어 있는지 확인하세요.

### 6. Supabase 상태 확인

Supabase 서비스 상태 페이지를 확인하세요:
- https://status.supabase.com/

## 임시 해결책 (MVP 수준)

현재 애플리케이션은 데이터베이스 연결 실패 시에도 동작하도록 설계되어 있습니다:

- **GET 요청**: 빈 배열/기본값 반환
- **POST 요청**: 503 Service Unavailable 응답

이를 통해 네트워크 문제가 있어도 애플리케이션이 크래시되지 않습니다.

## 근본적인 해결책

### 옵션 1: Windows에서 직접 실행

WSL2 대신 Windows에서 Python 가상환경을 사용하여 백엔드를 실행:

```powershell
# Windows PowerShell
cd C:\path\to\household
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 옵션 2: Docker 사용

Docker를 사용하면 네트워크 문제를 우회할 수 있습니다:

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 옵션 3: 로컬 PostgreSQL 사용 (개발용)

개발 환경에서는 로컬 PostgreSQL을 사용할 수 있습니다:

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb household_db
```

`.env` 파일 수정:
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/household_db
```

## 추가 디버깅

### 네트워크 연결 테스트

```bash
# Supabase 호스트에 ping 테스트
ping db.fqgcxjddhddcrbazuseu.supabase.co

# 포트 연결 테스트
nc -zv db.fqgcxjddhddcrbazuseu.supabase.co 5432
```

### 상세 로그 확인

백엔드 서버 실행 시 상세 로그 확인:
```bash
uvicorn app.main:app --reload --log-level debug
```

## 문의 및 지원

문제가 계속되면:
1. `test_db_connection.py` 실행 결과를 확인
2. WSL2 버전 확인: `wsl --version`
3. Windows 버전 확인: `winver`
