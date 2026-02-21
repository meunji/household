-- 가족 그룹 "아은이네" 데이터 삭제 쿼리
-- 주의: 이 쿼리는 가족 그룹과 관련된 모든 데이터를 삭제합니다.

-- 1. 가족 그룹 이름으로 그룹 찾기
-- 먼저 어떤 그룹이 있는지 확인
SELECT id, name, admin_user_id, created_at 
FROM family_groups 
WHERE name = '아은이네';

-- 2. 해당 그룹의 구성원 확인
SELECT fm.id, fm.family_group_id, fm.user_id, fm.role, fg.name as group_name
FROM family_members fm
JOIN family_groups fg ON fm.family_group_id = fg.id
WHERE fg.name = '아은이네';

-- 3. 가족 그룹 삭제 (CASCADE로 구성원도 자동 삭제됨)
-- 주의: 이 쿼리를 실행하면 "아은이네" 그룹과 모든 구성원이 삭제됩니다.
DELETE FROM family_groups 
WHERE name = '아은이네';

-- 4. 삭제 확인
SELECT COUNT(*) as remaining_groups FROM family_groups WHERE name = '아은이네';
SELECT COUNT(*) as remaining_members FROM family_members 
WHERE family_group_id IN (SELECT id FROM family_groups WHERE name = '아은이네');

-- 참고: 가족 그룹을 삭제해도 자산(assets)이나 거래(transactions) 데이터는 삭제되지 않습니다.
--       각 사용자의 개별 데이터는 그대로 유지됩니다.
