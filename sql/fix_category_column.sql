-- category 컬럼 제약조건 수정
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- category 컬럼을 nullable로 변경
ALTER TABLE transactions ALTER COLUMN category DROP NOT NULL;

-- 확인: category_id가 NOT NULL인지 확인 (필요시 추가)
-- ALTER TABLE transactions ALTER COLUMN category_id SET NOT NULL;
