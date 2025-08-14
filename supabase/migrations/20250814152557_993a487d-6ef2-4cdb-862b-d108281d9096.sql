-- Remove the anonymous read access policy that allows anyone to view exercise sessions
DROP POLICY IF EXISTS "Allow anonymous read access to exercise sessions" ON public.exercise_sessions;

-- Also remove the duplicate anonymous read policy for exercise_results if it exists
DROP POLICY IF EXISTS "Allow anonymous read access to exercise results" ON public.exercise_results;

-- Ensure only authenticated users can access their own exercise sessions and results
-- The existing user-specific policies will handle proper access control