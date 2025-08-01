# 🧠 Cogneto - Intelligent Note-Taking Platform

An innovative AI-driven note-taking application that transforms how you capture, connect, and evolve your ideas into a comprehensive knowledge network. Built for thinkers, researchers, and lifelong learners who want to unlock the full potential of their thoughts.

![React](https://img.shields.io/badge/react-v18+-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-v14+-black.svg)
![TypeScript](https://img.shields.io/badge/typescript-v5+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Project Overview

*Cogneto* is a sophisticated intelligent note-taking platform designed to help users connect, organize, and evolve their thoughts into a network of interconnected ideas. Unlike traditional note-taking applications, Cogneto leverages advanced AI algorithms to provide smart suggestions, uncover hidden connections between concepts, and facilitate the natural evolution of ideas from simple thoughts into comprehensive knowledge systems.

The platform serves as a "second brain" for users, enabling them to build a dynamic, ever-growing repository of knowledge that adapts and expands with their learning journey. Whether you're a student conducting research, a professional organizing project insights, or a creative individual developing complex ideas, Cogneto provides the tools to transform scattered thoughts into meaningful, connected knowledge.

## ✨ Key Features

### 🤖 *AI-Powered Intelligence*
- *Smart Suggestions*: Advanced algorithms analyze your content to suggest related notes and uncover hidden connections
- *Automatic Tag Generation*: AI-powered tagging system that intelligently categorizes your notes
- *Content Summarization*: Automatic generation of concise summaries for lengthy notes
- *Pattern Recognition*: Identifies recurring themes and concepts across your knowledge base

### 🔗 *Connected Thinking System*
- *Knowledge Graph Visualization*: Interactive network view showing relationships between your ideas
- *Dynamic Link Discovery*: Automatically suggests connections between related concepts
- *Contextual Associations*: Surface relevant notes based on your current focus area
- *Semantic Relationships*: Understanding meaning beyond keyword matching

### 📈 *Idea Evolution Framework*
- *Timeline View*: Chronological organization showing how your ideas develop over time
- *Version Tracking*: Monitor how concepts evolve and branch into new directions
- *Concept Maturation*: Visual representation of idea development stages
- *Knowledge Synthesis*: Combine multiple notes into comprehensive insights

### 📝 *Advanced Note Management*
- *Rich Text Editor*: Full-featured writing environment with formatting options
- *Multi-media Support*: Attach images, documents, and other files to your notes
- *Flexible Organization*: Tags, collections, and favorites for personalized organization
- *Search & Discovery*: Powerful search with filters and smart recommendations

### 📊 *Productivity Enhancement*
- *Priority Matrix*: Eisenhower Matrix implementation for task and idea prioritization
- *Task Management*: Integrated to-do system with due dates and reminders
- *Focus Modes*: Distraction-free writing environments tailored to different activities
- *Progress Tracking*: Monitor your knowledge-building journey with analytics

### 🔐 *Secure User Experience*
- *Authentication System*: Secure sign-up, login, and session management
- *Data Privacy*: End-to-end encryption for sensitive information
- *Cloud Synchronization*: Seamless access across multiple devices
- *Backup & Recovery*: Automatic data protection and recovery options

## 🚀 Installation

### Prerequisites
- *Node.js* (v18.0 or higher)
- *Package Manager*: npm, yarn, or pnpm
- *Database*: PostgreSQL (via Supabase)
- *API Keys*: Google Generative AI API key

### Local Development Setup

1. *Clone the repository:*
   bash
   git clone https://github.com/binayakbartaula11/Cogneto_Final.git
   cd Cogneto_Final
   

2. *Install dependencies:*
   bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   

3. *Environment Configuration:*
   
   Create a .env.local file in the root directory:
   env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Google AI Configuration
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   
   # Application Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   

4. *Database Setup:*
   bash
   # Run database migrations
   pnpm supabase:migrate
   
   # Seed initial data (optional)
   pnpm db:seed
   

5. *Start the development server:*
   bash
   pnpm dev
   

6. *Access the application:*
   
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

#### Vercel Deployment (Recommended)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod


#### Docker Deployment
bash
# Build Docker image
docker build -t cogneto .

# Run container
docker run -p 3000:3000 --env-file .env.local cogneto


## 🎯 Usage

### Getting Started

1. *Account Creation:*
   - Navigate to the sign-up page
   - Create your account using email or social authentication
   - Complete the onboarding process to customize your experience

2. *Creating Your First Note:*
   
   Dashboard → New Note → Add Title & Content → Save
   
   - Use the rich text editor for formatting
   - Add tags manually or let AI suggest them
   - Set priority levels using the matrix system

3. *Building Connections:*
   - Use [[note title]] syntax to link notes
   - Explore the Knowledge Graph to visualize connections
   - Review AI-suggested related notes in the sidebar

### Core Workflows

#### *Smart Note Creation*
typescript
// Example of AI-enhanced note creation
const newNote = {
  title: "Machine Learning Fundamentals",
  content: "Detailed explanation of ML concepts...",
  tags: [], // AI will suggest relevant tags
  priority: "important-urgent"
};


#### *Knowledge Graph Exploration*
- Access via Dashboard → Knowledge Graph
- Navigate using mouse/touch interactions
- Filter by tags, dates, or priority levels
- Click nodes to view note details

#### *Timeline View*
- Dashboard → Timeline View
- Scroll through chronological note history
- Identify knowledge evolution patterns
- Track learning progressions

### Advanced Features

#### *AI Processing Pipeline*
The system automatically processes new notes through several AI enhancement stages:

1. *Content Analysis*: Extracts key concepts and themes
2. *Tag Generation*: Suggests relevant categorization tags
3. *Summary Creation*: Generates concise note summaries
4. *Connection Discovery*: Identifies links to existing notes
5. *Priority Assessment*: Recommends priority classifications

#### *Search & Discovery*

Search syntax examples:
- tag:research priority:high
- created:last-week contains:AI
- connected:["Neural Networks"]


## 🛠 Technologies Used

### *Frontend Stack*
- *React 18*: Modern UI library with concurrent features
- *Next.js 14*: Full-stack React framework with App Router
- *TypeScript*: Type-safe development environment
- *Tailwind CSS*: Utility-first CSS framework
- *Radix UI*: Accessible component primitives
- *Framer Motion*: Animation and gesture library

### *Backend & Database*
- *Supabase*: Backend-as-a-Service platform
- *PostgreSQL*: Relational database with advanced querying
- *Row Level Security*: Database-level access control
- *Real-time Subscriptions*: Live data synchronization

### *AI & Machine Learning*
- *Google Generative AI*: Advanced language model integration
- *Natural Language Processing*: Content analysis and understanding
- *Semantic Search*: Meaning-based note discovery
- *Vector Embeddings*: Mathematical representation of note content

### *Development Tools*
- *ESLint*: Code quality and consistency
- *Prettier*: Code formatting
- *Husky*: Git hooks for quality assurance
- *Vercel*: Deployment and hosting platform

### *Libraries & Utilities*
- *Lucide React*: Beautiful icon system
- *React Hook Form*: Form management
- *Zod*: Schema validation
- *Date-fns*: Date manipulation utilities

## 📡 API Documentation

### Authentication Endpoints

#### **POST /api/auth/signup**
Create a new user account
typescript
Request Body:
{
  email: string;
  password: string;
  full_name: string;
}

Response:
{
  user: User;
  session: Session;
}


#### **POST /api/auth/login**
Authenticate existing user
typescript
Request Body:
{
  email: string;
  password: string;
}

Response:
{
  user: User;
  session: Session;
}


### Notes Management

#### **POST /api/notes**
Create a new note
typescript
Request Body:
{
  title: string;
  content: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

Response:
{
  id: string;
  title: string;
  content: string;
  ai_summary?: string;
  suggested_tags: string[];
  created_at: string;
}


#### **GET /api/notes/:id**
Retrieve a specific note
typescript
Response:
{
  id: string;
  title: string;
  content: string;
  tags: string[];
  connections: Connection[];
  created_at: string;
  updated_at: string;
}


### AI Enhancement

#### **POST /api/notes/ai-process**
Process note content with AI
typescript
Request Body:
{
  title: string;
  content: string;
}

Response:
{
  summary: string;
  suggested_tags: string[];
  key_concepts: string[];
  priority_suggestion: string;
  related_notes: string[];
}


### Knowledge Graph

#### **GET /api/graph/data**
Retrieve knowledge graph data
typescript
Response:
{
  nodes: GraphNode[];
  edges: GraphEdge[];
  metrics: {
    total_notes: number;
    total_connections: number;
    density: number;
  }
}


## 🤝 Contributing

We welcome contributions from the academic and developer community! Here's how you can help improve Cogneto:

### Getting Started

1. *Fork the repository* on GitHub
2. *Clone your fork* locally:
   bash
   git clone https://github.com/binayakbartaula11/Cogneto_Final.git
   
3. *Create a feature branch*:
   bash
   git checkout -b feature/amazing-enhancement
   
4. *Set up the development environment* following the installation guide

### Development Guidelines

#### *Code Standards*
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Include tests for new features
- Update documentation for API changes

#### *Pull Request Process*
1. Ensure all tests pass: pnpm test
2. Run linting: pnpm lint
3. Update README.md if needed
4. Create detailed PR description
5. Request review from maintainers

### Contribution Areas

#### *High Priority*
- *AI Algorithm Improvements*: Enhance connection discovery and suggestion accuracy
- *Performance Optimization*: Database query optimization and frontend performance
- *Mobile Responsive Design*: Improve mobile user experience
- *Accessibility Features*: WCAG compliance and screen reader support

#### *Feature Requests*
- *Export Functionality*: PDF, Markdown, and other format exports
- *Collaboration Features*: Real-time collaborative editing
- *Advanced Visualizations*: 3D knowledge graphs and timeline animations
- *Integration APIs*: Third-party app integrations (Notion, Obsidian, etc.)

#### *Bug Reports*
Please use the GitHub issue template and include:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or screen recordings
- Environment details (browser, OS, etc.)

## 📄 License

This project is licensed under the *MIT License* - see the [LICENSE](LICENSE) file for details.


MIT License

Copyright (c) 2025 Cogneto Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.


## 🏆 Acknowledgments

### *Open Source Libraries*
- *Supabase Team* for providing an excellent backend-as-a-service platform
- *Vercel Team* for Next.js and deployment infrastructure
- *Radix UI Team* for accessible component primitives
- *Tailwind CSS Team* for the utility-first CSS framework

### *AI & Research*
- *Google AI Team* for Generative AI API access
- *OpenAI Research* for advancements in language models
- *Knowledge Management Research Community* for theoretical foundations

### *Academic Support*
- *Professor [Name]* - Project supervisor and academic guidance
- *[University Name]* - Institutional support and resources
- *Computer Science Department* - Technical mentorship and feedback

### *Special Thanks*
- Beta testers and early adopters who provided valuable feedback
- Open source community for continuous inspiration and support
- Fellow students and colleagues for collaborative development

## 📞 Contact Information

### *Development Team*
- *Lead Developer*: Binayak Bartaula - binayak.221211@ncit.edu.np
- *Project Supervisor*: Manil Baidhya - manil.baidhya@ncit.edu.np
- *University*: Pokhara University, Nepal College of Information Technology | Department of Computer Engineering

### *Support & Inquiries*
- *Email*: cogneto.support@university.edu
- *GitHub Issues*: [Repository Issues Page](https://github.com//binayakbartaula11/Cogneto_Final/issues)
- *Academic Contact*: [Professor Email] for academic-related inquiries

### *Presentation & Demo*
- *Live Demo*: [Cogneto](https://cogneto.vercel.app/)
- *Project Presentation*: Available upon request for academic evaluation
- *Documentation*: Comprehensive technical documentation available in /docs folder

---

*Cogneto* - Transforming thoughts into connected knowledge

Built with ❤ for the academic community and lifelong learners everywhere.
