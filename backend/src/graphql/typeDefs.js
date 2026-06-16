const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    developer(id: ID!): Developer
    developers(limit: Int, offset: Int): [Developer]
    assessments(category: String, difficulty: String): [Assessment]
    assessment(id: ID!): Assessment
    mySkills: [Skill]
    recommendations(limit: Int): [Recommendation]
    teams: [Team]
    team(id: ID!): Team
    reports(limit: Int): [Report]
  }

  type Mutation {
    updateProfile(input: ProfileInput!): Developer
    addSkills(skills: [SkillInput!]!): [Skill]
    startAssessment(assessmentId: ID!): AssessmentSession
    submitAssessment(sessionId: ID!, answers: [AnswerInput!]!): AssessmentResult
    createTeam(name: String!, description: String): Team
    addTeamMember(teamId: ID!, userId: ID!, role: String): TeamMember
    generateReport(type: String!): Report
  }

  type Developer {
    id: ID!
    email: String!
    name: String!
    profile: Profile
    skills: [Skill]
    assessments: [AssessmentSession]
    recommendations: [Recommendation]
    createdAt: String!
  }

  type Profile {
    bio: String
    profileImage: String
    yearsExperience: Int
    currentRole: String
    company: String
    location: String
    github: String
    linkedin: String
    portfolio: String
  }

  type Skill {
    id: ID!
    name: String!
    category: String!
    proficiency: Int!
    yearsOfExperience: Float!
    lastUpdated: String!
  }

  type Assessment {
    id: ID!
    title: String!
    description: String!
    category: String!
    difficulty: String!
    duration: Int!
    questions: [Question]
    isActive: Boolean!
  }

  type Question {
    id: ID!
    text: String!
    type: String!
    options: [String]
    category: String!
    points: Int!
  }

  type AssessmentSession {
    id: ID!
    assessment: Assessment!
    startedAt: String!
    completedAt: String
    score: Int
    percentage: Float
  }

  type AssessmentResult {
    sessionId: ID!
    score: Int!
    percentage: Float!
    feedback: [QuestionFeedback]
  }

  type QuestionFeedback {
    questionId: ID!
    correct: Boolean!
    correctAnswer: String
  }

  type Recommendation {
    id: ID!
    skillName: String!
    skillCategory: String!
    confidence: Float!
    reason: String!
  }

  type Team {
    id: ID!
    name: String!
    description: String!
    members: [TeamMember]
    analytics: TeamAnalytics
  }

  type TeamMember {
    user: Developer!
    role: String!
    joinedAt: String!
  }

  type TeamAnalytics {
    teamSize: Int!
    skillDistribution: [SkillDistribution]
  }

  type SkillDistribution {
    category: String!
    averageProficiency: Float!
    developerCount: Int!
  }

  type Report {
    id: ID!
    type: String!
    data: String!
    createdAt: String!
  }

  input ProfileInput {
    bio: String
    currentRole: String
    company: String
    location: String
    github: String
    linkedin: String
    portfolio: String
  }

  input SkillInput {
    name: String!
    category: String!
    proficiency: Int!
    yearsOfExperience: Float!
  }

  input AnswerInput {
    questionId: ID!
    selected: String!
  }
`;

module.exports = typeDefs;
