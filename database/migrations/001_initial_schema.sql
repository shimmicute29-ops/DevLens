-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Developer Profiles
CREATE TABLE IF NOT EXISTS developer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  profile_image_url VARCHAR(500),
  years_experience INT,
  current_role VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Developer Skills
CREATE TABLE IF NOT EXISTS developer_skills (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  skill_category VARCHAR(100) NOT NULL,
  proficiency INT DEFAULT 0,
  years_of_experience DECIMAL(3,1),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_name)
);

-- Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50),
  duration_minutes INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Questions
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type VARCHAR(50),
  options JSONB,
  correct_answer VARCHAR(255),
  category VARCHAR(100),
  points INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Sessions
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  score INT,
  percentage DECIMAL(5,2),
  feedback JSONB
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(team_id, user_id)
);

-- Skill Recommendations
CREATE TABLE IF NOT EXISTS skill_recommendations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  skill_category VARCHAR(100),
  confidence DECIMAL(3,2),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(100),
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_developer_skills_user ON developer_skills(user_id);
CREATE INDEX idx_assessment_sessions_user ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_assessment ON assessment_sessions(assessment_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_skill_recommendations_user ON skill_recommendations(user_id);
CREATE INDEX idx_reports_user ON reports(user_id);
