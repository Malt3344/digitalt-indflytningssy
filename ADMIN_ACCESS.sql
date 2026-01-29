-- =====================================================
-- GIVE ADMIN/UNLIMITED ACCESS TO SPECIFIC USER
-- Kør dette i Supabase SQL Editor
-- =====================================================

-- Opdater user_profile for malthe.schwartz.waluga@gmail.com
-- Giver enterprise abonnement med uendelig adgang
UPDATE user_profiles
SET 
    subscription_status = 'active',
    subscription_tier = 'enterprise',
    subscription_current_period_end = '2099-12-31 23:59:59+00',
    updated_at = NOW()
WHERE email = 'malthe.schwartz.waluga@gmail.com';

-- Marker alle eksisterende og fremtidige syn som betalte for denne bruger
UPDATE inspections
SET is_paid = true
WHERE landlord_id = (
    SELECT id FROM user_profiles WHERE email = 'malthe.schwartz.waluga@gmail.com'
);

-- Verificer at det virkede
SELECT 
    email,
    subscription_status,
    subscription_tier,
    subscription_current_period_end,
    inspections_count
FROM user_profiles 
WHERE email = 'malthe.schwartz.waluga@gmail.com';
