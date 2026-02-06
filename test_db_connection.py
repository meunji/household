#!/usr/bin/env python3
"""
데이터베이스 연결 테스트 스크립트
WSL2에서 Supabase PostgreSQL 연결을 테스트합니다.
"""
import asyncio
import asyncpg
from app.config import settings
import sys

async def test_connection():
    """데이터베이스 연결 테스트"""
    print("=" * 60)
    print("데이터베이스 연결 테스트 시작")
    print("=" * 60)
    print(f"연결 URL: {settings.database_url.split('@')[1] if '@' in settings.database_url else 'N/A'}")
    print()
    
    try:
        # URL에서 연결 정보 추출
        # postgresql+asyncpg://postgres:password@host:port/db
        url_parts = settings.database_url.replace("postgresql+asyncpg://", "").split("@")
        if len(url_parts) != 2:
            print("❌ 잘못된 DATABASE_URL 형식")
            return False
            
        auth_part = url_parts[0]
        host_part = url_parts[1]
        
        user, password = auth_part.split(":")
        host_port_db = host_part.split("/")
        host_port = host_port_db[0].split(":")
        host = host_port[0]
        port = int(host_port[1]) if len(host_port) > 1 else 5432
        database = host_port_db[1] if len(host_port_db) > 1 else "postgres"
        
        # URL 디코딩 (비밀번호의 %21 -> !)
        password = password.replace("%21", "!")
        
        print(f"호스트: {host}")
        print(f"포트: {port}")
        print(f"데이터베이스: {database}")
        print(f"사용자: {user}")
        print()
        
        print("연결 시도 중...")
        # SSL 설정: Connection Pooler 사용 시 인증서 검증 완화 (개발 환경)
        import ssl
        ssl_context = ssl.create_default_context()
        # Pooler 사용 시 인증서 검증 완화 (개발 환경용)
        # 프로덕션에서는 인증서 검증을 유지하는 것이 좋습니다
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        conn = await asyncpg.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl=ssl_context,
            timeout=10,
        )
        
        print("✅ 연결 성공!")
        
        # 간단한 쿼리 테스트
        result = await conn.fetchval("SELECT version()")
        print(f"PostgreSQL 버전: {result.split(',')[0]}")
        
        # 테이블 확인
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        
        if tables:
            print(f"\n✅ 발견된 테이블 ({len(tables)}개):")
            for table in tables:
                print(f"  - {table['table_name']}")
        else:
            print("\n⚠️  테이블이 없습니다. 스키마를 생성해야 합니다.")
        
        await conn.close()
        print("\n✅ 연결 테스트 완료!")
        return True
        
    except asyncio.TimeoutError:
        print("\n❌ 연결 타임아웃: 네트워크 연결이 너무 느립니다.")
        print("\n해결 방법:")
        print("1. WSL2 네트워크 재시작: Windows PowerShell에서 'wsl --shutdown' 실행")
        print("2. 인터넷 연결 확인")
        print("3. VPN이 활성화되어 있다면 비활성화 후 재시도")
        return False
        
    except OSError as e:
        if "Network is unreachable" in str(e) or e.errno == 101:
            print("\n❌ 네트워크 연결 불가: [Errno 101] Network is unreachable")
            print("\n해결 방법:")
            print("1. WSL2 네트워크 재시작:")
            print("   Windows PowerShell에서 실행:")
            print("   wsl --shutdown")
            print("   그 후 WSL2를 다시 시작")
            print("\n2. Windows 방화벽 확인:")
            print("   - Windows 방화벽이 PostgreSQL 포트(5432)를 차단하지 않는지 확인")
            print("\n3. VPN 확인:")
            print("   - VPN을 사용 중이라면 일시적으로 비활성화 후 재시도")
            print("\n4. 네트워크 어댑터 확인:")
            print("   - WSL2 네트워크 어댑터가 활성화되어 있는지 확인")
        else:
            print(f"\n❌ 연결 오류: {e}")
        return False
        
    except Exception as e:
        error_msg = str(e)
        if "CERTIFICATE_VERIFY_FAILED" in error_msg or "certificate verify failed" in error_msg:
            print(f"\n❌ SSL 인증서 검증 오류: {e}")
            print("\n해결 방법:")
            print("1. SSL 인증서 검증을 완화하여 재시도 (개발 환경용)")
            print("2. 시스템의 CA 인증서 업데이트")
            print("3. Supabase SSL 인증서 확인")
            print("\n임시 해결책 (개발 환경):")
            print("  test_db_connection.py에서 ssl_context 설정을 수정하세요:")
            print("  ssl_context.check_hostname = False")
            print("  ssl_context.verify_mode = ssl.CERT_NONE")
        else:
            print(f"\n❌ 예상치 못한 오류: {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
