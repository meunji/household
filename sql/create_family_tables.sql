-- 가족 그룹 및 구성원 테이블 생성
-- 가족 간 계정 정보 공유를 위한 테이블

-- 가족 그룹 테이블
CREATE TABLE IF NOT EXISTS family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    admin_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_family_groups_admin_user FOREIGN KEY (admin_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 가족 구성원 테이블
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER', -- 'ADMIN' or 'MEMBER'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_family_members_group FOREIGN KEY (family_group_id) REFERENCES family_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_family_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT unique_family_member UNIQUE (family_group_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_family_groups_admin_user_id ON family_groups(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family_group_id ON family_members(family_group_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);

-- ENUM 타입 생성 (PostgreSQL)
DO $$ BEGIN
    CREATE TYPE familyrole AS ENUM ('ADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- role 컬럼 타입 변경 (ENUM 사용)
ALTER TABLE family_members 
    ALTER COLUMN role TYPE familyrole USING role::familyrole;

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_family_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_family_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_family_groups_updated_at ON family_groups;
CREATE TRIGGER trigger_update_family_groups_updated_at
    BEFORE UPDATE ON family_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_family_groups_updated_at();

DROP TRIGGER IF EXISTS trigger_update_family_members_updated_at ON family_members;
CREATE TRIGGER trigger_update_family_members_updated_at
    BEFORE UPDATE ON family_members
    FOR EACH ROW
    EXECUTE FUNCTION update_family_members_updated_at();
