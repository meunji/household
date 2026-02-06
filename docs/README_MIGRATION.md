# 데이터베이스 마이그레이션 가이드

## 방법 1: Supabase 대시보드에서 직접 실행 (권장)

네트워크 연결 문제가 있는 경우, Supabase 대시보드에서 직접 SQL을 실행할 수 있습니다.

1. Supabase 대시보드에 로그인
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. `sql/init_schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭

이 방법으로 테이블이 생성됩니다.

## 방법 2: Alembic 사용 (네트워크 연결 가능한 경우)

네트워크 연결이 정상적으로 작동하는 경우:

```bash
# 마이그레이션 적용
alembic upgrade head

# 마이그레이션 상태 확인
alembic current

# 마이그레이션 히스토리 확인
alembic history
```

## 방법 3: Connection Pooling 사용

Supabase Connection Pooling을 사용하면 더 안정적인 연결이 가능할 수 있습니다.

1. Supabase 대시보드 → Settings → Database
2. Connection string에서 **Transaction** 모드 선택
3. 연결 문자열을 복사 (포트는 6543)
4. `.env` 파일의 `DATABASE_URL`을 업데이트

예시:
```
DATABASE_URL=postgresql+asyncpg://postgres.fqgcxjddhddcrbazuseu:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

## 마이그레이션 확인

마이그레이션이 성공적으로 적용되었는지 확인:

```sql
-- Supabase SQL Editor에서 실행
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 예상 결과:
-- assets
-- transactions  
-- users
```

## 문제 해결

### 네트워크 연결 오류가 계속되는 경우

1. **WSL2 네트워크 재시작**:
   ```bash
   # Windows PowerShell에서
   wsl --shutdown
   ```

2. **방화벽 확인**: Windows 방화벽이 PostgreSQL 포트(5432)를 차단하지 않는지 확인

3. **VPN 확인**: VPN을 사용 중이라면 일시적으로 비활성화 후 테스트

4. **Supabase 상태 확인**: Supabase 서비스 상태 페이지 확인

### 마이그레이션 적용 후 확인

```bash
# Alembic 버전 확인
alembic current

# 예상 출력: 2b000e0f6379 (head)
```
