-- 초기 스키마 생성 SQL
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- ENUM 타입 생성
CREATE TYPE assettype AS ENUM ('CASH', 'LOAN');
CREATE TYPE transactiontype AS ENUM ('INCOME', 'EXPENSE');

-- users 테이블 생성
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- users 테이블 인덱스 생성
CREATE INDEX ix_users_user_id ON users(user_id);

-- assets 테이블 생성
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    type assettype NOT NULL,
    name VARCHAR NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_assets_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- assets 테이블 인덱스 생성
CREATE INDEX ix_assets_user_id ON assets(user_id);

-- transactions 테이블 생성
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    type transactiontype NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category VARCHAR NOT NULL,
    date DATE NOT NULL,
    memo VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_transactions_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- transactions 테이블 인덱스 생성
CREATE INDEX ix_transactions_user_id ON transactions(user_id);
CREATE INDEX ix_transactions_date ON transactions(date);

-- updated_at 자동 업데이트를 위한 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
