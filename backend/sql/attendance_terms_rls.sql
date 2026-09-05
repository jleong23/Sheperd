-- Enable RLS on attendance_terms if it exists
ALTER TABLE public.attendance_terms ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly broad policies before recreating them
DROP POLICY IF EXISTS "attendance_terms_select_all" ON public.attendance_terms;
DROP POLICY IF EXISTS "attendance_terms_insert_all" ON public.attendance_terms;
DROP POLICY IF EXISTS "attendance_terms_update_all" ON public.attendance_terms;
DROP POLICY IF EXISTS "attendance_terms_delete_all" ON public.attendance_terms;

-- Allow users to read terms that were created by themselves or by leaders in their hierarchy
CREATE POLICY "attendance_terms_select_visible_scope"
ON public.attendance_terms
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.users AS owner_user
      WHERE owner_user.leader_id = created_by
        AND (
          owner_user.leader_id = auth.uid()
          OR owner_user.pastor_id = auth.uid()
        )
    )
  )
);

-- Allow users to insert terms for themselves or for leaders they pastor
CREATE POLICY "attendance_terms_insert_visible_scope"
ON public.attendance_terms
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.users AS owner_user
      WHERE owner_user.leader_id = created_by
        AND (
          owner_user.leader_id = auth.uid()
          OR owner_user.pastor_id = auth.uid()
        )
    )
  )
);

-- Allow users to update terms for themselves or for leaders they pastor
CREATE POLICY "attendance_terms_update_visible_scope"
ON public.attendance_terms
FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.users AS owner_user
      WHERE owner_user.leader_id = created_by
        AND (
          owner_user.leader_id = auth.uid()
          OR owner_user.pastor_id = auth.uid()
        )
    )
  )
);

-- Allow users to delete terms for themselves or for leaders they pastor
CREATE POLICY "attendance_terms_delete_visible_scope"
ON public.attendance_terms
FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.users AS owner_user
      WHERE owner_user.leader_id = created_by
        AND (
          owner_user.leader_id = auth.uid()
          OR owner_user.pastor_id = auth.uid()
        )
    )
  )
);
