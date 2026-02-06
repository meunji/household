#!/bin/bash
# Supabase 데이터베이스 연결 문자열 업데이트 스크립트

echo "=========================================="
echo "Supabase 데이터베이스 연결 설정 업데이트"
echo "=========================================="
echo ""
echo "Supabase 대시보드에서 연결 문자열을 가져오는 방법:"
echo ""
echo "1. https://supabase.com/dashboard 접속"
echo "2. 프로젝트 선택 (fqgcxjddhddcrbazuseu)"
echo "3. Settings (⚙️) → Database 클릭"
echo "4. Connection string 섹션으로 스크롤"
echo "5. 원하는 연결 모드 선택:"
echo "   - Direct connection (포트 5432) - asyncpg 권장"
echo "   - Connection Pooling - Session mode (포트 5432)"
echo "   - Connection Pooling - Transaction mode (포트 6543)"
echo "6. URI 형식 선택 후 Copy"
echo ""
echo "=========================================="
echo ""
read -p "새로운 DATABASE_URL을 입력하세요: " NEW_URL

if [ -z "$NEW_URL" ]; then
    echo "❌ 입력이 비어있습니다. 취소되었습니다."
    exit 1
fi

# .env 파일 백업
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ .env 파일 백업 완료"

# DATABASE_URL 업데이트
# postgresql:// 형식을 postgresql+asyncpg:// 형식으로 변환
if [[ $NEW_URL == postgresql://* ]]; then
    NEW_URL=${NEW_URL/postgresql:\/\//postgresql+asyncpg:\/\/}
fi

# .env 파일에서 DATABASE_URL 라인 찾아서 교체
if grep -q "^DATABASE_URL=" .env; then
    # 기존 DATABASE_URL 주석 처리된 라인도 확인
    sed -i '/^DATABASE_URL=/d' .env
    sed -i '/^#.*DATABASE_URL=/d' .env
fi

# 새로운 DATABASE_URL 추가 (Database Configuration 섹션에)
if grep -q "^# Database Configuration" .env; then
    # Database Configuration 섹션 다음에 추가
    sed -i "/^# Database Configuration/a DATABASE_URL=$NEW_URL" .env
else
    # 파일 시작 부분에 추가
    echo "" >> .env
    echo "# Database Configuration" >> .env
    echo "DATABASE_URL=$NEW_URL" >> .env
fi

echo "✅ DATABASE_URL 업데이트 완료"
echo ""
echo "변경된 내용:"
grep "^DATABASE_URL=" .env
echo ""
echo "연결 테스트를 실행하세요:"
echo "  python3 test_db_connection.py"
