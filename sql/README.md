# SQL 스크립트 디렉토리

이 디렉토리에는 데이터베이스 스키마 생성 및 마이그레이션을 위한 SQL 스크립트가 포함되어 있습니다.

## 파일 설명

### 초기 설정

- **`init_schema.sql`**: 초기 데이터베이스 스키마 생성
  - users, assets, transactions 테이블 생성
  - ENUM 타입 정의
  - 인덱스 및 외래키 설정
  - Supabase 대시보드의 SQL Editor에서 실행

- **`setup_alembic_version.sql`**: Alembic 버전 테이블 설정
  - Alembic 마이그레이션 시스템 초기화
  - 수동 마이그레이션 후 실행

### 마이그레이션

- **`migration_add_categories.sql`**: 카테고리 테이블 추가 및 transactions 테이블 수정
  - categories 테이블 생성
  - 기본 카테고리 데이터 삽입
  - transactions 테이블에 category_id 컬럼 추가
  - 외래키 및 인덱스 설정

- **`fix_category_column.sql`**: category 컬럼 제약조건 수정
  - category 컬럼을 nullable로 변경
  - migration_add_categories.sql 실행 후 필요시 실행

## 실행 순서

1. **초기 설정** (새 프로젝트인 경우):
   ```sql
   -- 1. init_schema.sql 실행
   -- 2. setup_alembic_version.sql 실행 (Alembic 사용 시)
   ```

2. **카테고리 기능 추가** (기존 프로젝트에 추가):
   ```sql
   -- 1. migration_add_categories.sql 실행
   -- 2. fix_category_column.sql 실행 (category 컬럼 제약조건 수정)
   ```

## 실행 방법

1. Supabase 대시보드 접속
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. SQL 파일 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭

## 주의사항

- 기존 데이터가 있는 경우 마이그레이션 전 백업 권장
- `migration_add_categories.sql` 실행 시 기존 transactions 데이터의 category_id는 수동으로 매핑 필요
- 프로덕션 환경에서는 신중하게 실행하세요
