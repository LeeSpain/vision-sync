-- Delete the redundant Vision-Sync Support Assistant agent
-- First delete any routing rules pointing to it
DELETE FROM agent_routing_rules WHERE target_agent_id = 'e95bb2b3-0aac-4ceb-b91c-8ee3f7b6c2eb';
DELETE FROM agent_routing_rules WHERE source_agent_id = 'e95bb2b3-0aac-4ceb-b91c-8ee3f7b6c2eb';

-- Delete any agent conversations referencing it
DELETE FROM agent_conversations WHERE agent_id = 'e95bb2b3-0aac-4ceb-b91c-8ee3f7b6c2eb';

-- Delete any training data for this agent
DELETE FROM ai_training_data WHERE agent_id = 'e95bb2b3-0aac-4ceb-b91c-8ee3f7b6c2eb';

-- Delete any settings for this agent
DELETE FROM ai_agent_settings WHERE agent_id = 'e95bb2b3-0aac-4ceb-b91c-8ee3f7b6c2eb';

-- Enable DELETE on ai_agents table (currently missing)
CREATE POLICY "Enable delete access for all users" ON public.ai_agents FOR DELETE USING (true);

-- Finally delete the agent itself
DELETE FROM ai_agents WHERE id = 'e95bb2b3-0aac-4ceb-b91c-8ee3f7b6c2eb';