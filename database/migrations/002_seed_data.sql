-- Insert sample assessments
INSERT INTO assessments (id, title, description, category, difficulty, duration_minutes, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Backend Fundamentals', 'Test your backend development knowledge', 'Backend', 'Easy', 30, true),
  ('550e8400-e29b-41d4-a716-446655440001', 'Advanced React Patterns', 'Master React patterns and best practices', 'Frontend', 'Hard', 45, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'DevOps Essentials', 'Docker, Kubernetes, and CI/CD fundamentals', 'DevOps', 'Medium', 40, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Cloud Architecture', 'Design scalable cloud systems on AWS/GCP/Azure', 'Cloud', 'Hard', 50, true);

-- Insert sample questions for Backend assessment
INSERT INTO assessment_questions (id, assessment_id, question, question_type, options, correct_answer, category, points)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 
   'What is a RESTful API?', 'multiple_choice', 
   '["A style of API using HTTP methods", "A database query language", "A frontend framework", "A server protocol"]', 
   'A style of API using HTTP methods', 'Backend', 10),
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000',
   'What does CRUD stand for?', 'multiple_choice',
   '["Create, Read, Update, Delete", "Cache, Replication, Upload, Download", "Control, Route, Update, Debug", "Compile, Release, Upgrade, Deploy"]',
   'Create, Read, Update, Delete', 'Backend', 10),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000',
   'What is the purpose of middleware in Express.js?', 'multiple_choice',
   '["To process requests and responses", "To handle database operations", "To manage frontend rendering", "To configure server ports"]',
   'To process requests and responses', 'Backend', 10);

-- Insert sample questions for Frontend assessment
INSERT INTO assessment_questions (id, assessment_id, question, question_type, options, correct_answer, category, points)
VALUES
  ('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001',
   'What is the purpose of React hooks?', 'multiple_choice',
   '["To manage state and side effects in functional components", "To replace class components entirely", "To handle routing", "To manage styling"]',
   'To manage state and side effects in functional components', 'Frontend', 10),
  ('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001',
   'What does useEffect do?', 'multiple_choice',
   '["Performs side effects after render", "Manages component state", "Handles events", "Manages styling"]',
   'Performs side effects after render', 'Frontend', 10);
