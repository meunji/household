-- 가족 그룹 구성원의 이메일 주소 확인 쿼리
-- Supabase SQL Editor에서 실행

-- 방법 1: 가족 그룹 이름으로 구성원 이메일 조회
SELECT 
    fm.id,
    fm.family_group_id,
    fm.user_id,
    fm.role,
    fg.name as group_name,
    fg.admin_user_id,
    au.email as user_email,
    CASE 
        WHEN fg.admin_user_id = fm.user_id THEN '관리자'
        ELSE '구성원'
    END as member_type
FROM family_members fm
JOIN family_groups fg ON fm.family_group_id = fg.id
LEFT JOIN auth.users au ON au.id::text = fm.user_id
WHERE fg.name = '아은이네'
ORDER BY 
    CASE WHEN fg.admin_user_id = fm.user_id THEN 0 ELSE 1 END,
    fm.created_at;

-- 방법 2: 특정 가족 그룹 ID로 구성원 이메일 조회
-- (가족 그룹 ID를 알고 있는 경우)
SELECT 
    fm.id,
    fm.family_group_id,
    fm.user_id,
    fm.role,
    fg.name as group_name,
    au.email as user_email,
    au.created_at as user_created_at
FROM family_members fm
JOIN family_groups fg ON fm.family_group_id = fg.id
LEFT JOIN auth.users au ON au.id::text = fm.user_id
WHERE fg.id = 'YOUR_FAMILY_GROUP_ID_HERE'  -- 실제 가족 그룹 ID로 변경
ORDER BY fm.role DESC, fm.created_at;

-- 방법 3: 모든 가족 그룹의 구성원 이메일 조회
SELECT 
    fg.name as group_name,
    fg.admin_user_id as admin_user_id,
    admin_au.email as admin_email,
    fm.user_id as member_user_id,
    member_au.email as member_email,
    fm.role,
    fm.created_at as joined_at
FROM family_groups fg
LEFT JOIN auth.users admin_au ON admin_au.id::text = fg.admin_user_id
JOIN family_members fm ON fm.family_group_id = fg.id
LEFT JOIN auth.users member_au ON member_au.id::text = fm.user_id
ORDER BY fg.name, 
    CASE WHEN fg.admin_user_id = fm.user_id THEN 0 ELSE 1 END,
    fm.created_at;

-- 방법 4: 특정 user_id의 이메일 확인
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE id::text = 'YOUR_USER_ID_HERE';  -- 실제 user_id로 변경

-- 방법 5: 이메일로 user_id 찾기
SELECT 
    id,
    email,
    created_at
FROM auth.users
WHERE email = 'user@example.com';  -- 실제 이메일로 변경
