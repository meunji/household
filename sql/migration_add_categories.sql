-- 카테고리 테이블 추가 및 기존 transactions 테이블 수정
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. categories 테이블 생성
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type transactiontype NOT NULL,
    name VARCHAR NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE(type, name)  -- 같은 유형 내에서 카테고리 이름 중복 방지
);

-- 2. categories 테이블 인덱스 생성
CREATE INDEX ix_categories_type ON categories(type);
CREATE INDEX ix_categories_display_order ON categories(type, display_order);

-- 3. 기본 카테고리 데이터 삽입
-- 수입 카테고리
INSERT INTO categories (type, name, display_order) VALUES
    ('INCOME', '월급', 1),
    ('INCOME', '상여', 2),
    ('INCOME', '배당금', 3);

-- 지출 카테고리
INSERT INTO categories (type, name, display_order) VALUES
    ('EXPENSE', '외식', 1),
    ('EXPENSE', '간식', 2),
    ('EXPENSE', '장보기', 3),
    ('EXPENSE', '쇼핑', 4),
    ('EXPENSE', '여행', 5),
    ('EXPENSE', '교육비', 6),
    ('EXPENSE', '의료비', 7),
    ('EXPENSE', '구독료', 8);

-- 4. 기존 transactions 테이블에 category_id 컬럼 추가
ALTER TABLE transactions ADD COLUMN category_id UUID;

-- 5. 기존 데이터 마이그레이션 (기존 category 문자열을 카테고리 ID로 변환)
-- 주의: 기존 데이터가 있다면 수동으로 매핑해야 합니다
-- 예시: 기존 '월급' 카테고리를 가진 거래를 새로운 카테고리 ID로 업데이트
-- UPDATE transactions t
-- SET category_id = (SELECT id FROM categories WHERE name = t.category AND type = t.type LIMIT 1)
-- WHERE category_id IS NULL;

-- 6. category 컬럼을 nullable로 변경 (필수!)
ALTER TABLE transactions ALTER COLUMN category DROP NOT NULL;

-- 7. category_id에 외래키 제약 조건 추가
ALTER TABLE transactions 
    ADD CONSTRAINT fk_transactions_category_id 
    FOREIGN KEY (category_id) REFERENCES categories(id);

-- 8. category_id에 인덱스 추가
CREATE INDEX ix_transactions_category_id ON transactions(category_id);

-- 9. (선택사항) 마이그레이션 완료 후 기존 category 컬럼 삭제
-- ALTER TABLE transactions DROP COLUMN category;
