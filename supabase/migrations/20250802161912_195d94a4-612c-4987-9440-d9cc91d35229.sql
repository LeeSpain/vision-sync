-- First, let's create a comprehensive pricing structure that matches what the frontend expects

-- Migration to update existing pricing data to standardized format
DO $$
DECLARE
    template_record RECORD;
    new_pricing JSONB;
BEGIN
    -- Loop through all templates and standardize their pricing
    FOR template_record IN 
        SELECT id, pricing, title FROM app_templates 
    LOOP
        -- Create a standardized pricing structure based on the complex frontend expectation
        new_pricing := jsonb_build_object(
            'base', COALESCE((template_record.pricing->>'oneTime')::numeric, (template_record.pricing->>'base')::numeric, 2500),
            'customization', COALESCE((template_record.pricing->>'setup')::numeric, (template_record.pricing->>'customization')::numeric, 500),
            'subscription', jsonb_build_object(
                'monthly', COALESCE((template_record.pricing->>'monthly')::numeric, 199),
                'benefits', ARRAY['Monthly updates', 'Priority support', 'Feature requests', 'Backup & maintenance']::text[]
            ),
            'deposit', jsonb_build_object(
                'amount', COALESCE((template_record.pricing->>'oneTime')::numeric * 0.3, 750),
                'serviceMonthly', COALESCE((template_record.pricing->>'monthly')::numeric * 0.75, 149),
                'description', 'Pay deposit + monthly service fee for ongoing management'
            ),
            'installments', jsonb_build_object(
                'available', true,
                'plans', jsonb_build_array(
                    jsonb_build_object(
                        'months', 6,
                        'monthlyAmount', COALESCE((template_record.pricing->>'oneTime')::numeric / 6 * 1.08, 450),
                        'totalAmount', COALESCE((template_record.pricing->>'oneTime')::numeric * 1.08, 2700)
                    ),
                    jsonb_build_object(
                        'months', 12,
                        'monthlyAmount', COALESCE((template_record.pricing->>'oneTime')::numeric / 12 * 1.15, 240),
                        'totalAmount', COALESCE((template_record.pricing->>'oneTime')::numeric * 1.15, 2880)
                    )
                )
            ),
            'ownership', jsonb_build_object(
                'buyOutright', COALESCE((template_record.pricing->>'oneTime')::numeric, (template_record.pricing->>'base')::numeric, 2500),
                'serviceContract', jsonb_build_object(
                    'deposit', COALESCE((template_record.pricing->>'oneTime')::numeric * 0.3, 750),
                    'monthly', COALESCE((template_record.pricing->>'monthly')::numeric * 0.75, 149),
                    'benefits', ARRAY['App hosting', 'Updates & maintenance', 'Technical support', 'Feature additions']::text[]
                )
            )
        );

        -- Update the template with the new standardized pricing
        UPDATE app_templates 
        SET pricing = new_pricing,
            updated_at = now()
        WHERE id = template_record.id;
        
        RAISE NOTICE 'Updated pricing for template: %', template_record.title;
    END LOOP;
END $$;