# Railway Start Command 오류 해결

`$PORT` 환경 변수가 확장되지 않는 문제 해결 방법입니다.

## 문제 상황

- Build는 성공
- Deploy 시 `$PORT` 환경 변수가 확장되지 않음
- 오류: `Invalid value for '--port': '$PORT' is not a valid integer`

## 해결 방법

### 방법 1: Railway Settings에서 Start Command 제거 (권장)

Railway가 Dockerfile의 CMD를 사용하도록 설정:

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Start Command** 필드 확인
4. **비워두거나 삭제** (Dockerfile의 CMD 사용)
5. 저장

### 방법 2: Dockerfile 수정 (이미 완료됨)

Dockerfile의 CMD를 쉘을 명시적으로 사용하도록 수정:

```dockerfile
CMD ["/bin/sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

이렇게 하면 쉘이 환경 변수를 확장합니다.

### 방법 3: Railway Settings에서 올바른 Start Command 설정

만약 Start Command를 사용해야 한다면:

1. Railway Settings → **Start Command**
2. 다음 명령어 입력:
   ```
   sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
   ```
3. 저장

## 확인 사항

### Railway Settings 확인

1. **Settings** 탭
2. **Start Command** 필드:
   - ✅ 비어있음 (Dockerfile 사용)
   - 또는 올바른 쉘 명령어

### Dockerfile 확인

Dockerfile의 마지막 줄:
```dockerfile
CMD ["/bin/sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

## 다음 단계

1. **Railway Settings에서 Start Command 확인 및 제거**
2. **Dockerfile 수정사항 푸시**:
   ```bash
   git add Dockerfile
   git commit -m "Fix Dockerfile CMD to properly expand PORT environment variable"
   git push origin main
   ```
3. **Railway 재배포**
4. **로그 확인**: `Application startup complete` 메시지 확인

## 테스트

배포 후 Railway 로그에서 확인:
- ✅ `Uvicorn running on http://0.0.0.0:XXXX` (포트 번호가 숫자로 표시)
- ❌ `$PORT` (문자열 그대로 표시되면 실패)
