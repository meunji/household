-- Alembic 버전 테이블 생성 및 초기 버전 등록
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

-- 초기 마이그레이션 버전 등록
INSERT INTO alembic_version (version_num) VALUES ('2b000e0f6379')
ON CONFLICT (version_num) DO NOTHING;
