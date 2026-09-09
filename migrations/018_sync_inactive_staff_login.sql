-- Keep account login state aligned for records already marked inactive.

BEGIN;

UPDATE public.staff_accounts AS account
SET
  status = 'inactive',
  can_login = false
FROM public.staffs AS staff
WHERE account.staff_id = staff.id
  AND staff.status = 'inactive'
  AND (
    account.status IS DISTINCT FROM 'inactive'
    OR account.can_login IS DISTINCT FROM false
  );

COMMIT;
