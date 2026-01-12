# NotePad - Modern Note-Taking Application

A full-stack, feature-rich note-taking application built with React and Supabase. Create, organize, and share your thoughts with a beautiful, modern interface that supports both private notes and public posts.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **User Authentication**: Secure registration and login using Supabase Auth
- **Rich Text Editor**: Create notes with formatting using React Quill
- **Folder Organization**: Organize notes into custom folders with icons and colors
- **Public Feed**: Share your thoughts publicly with a social media-like feed
- **Private Notes**: Keep personal notes private and secure
- **Search Functionality**: Search through your notes and public posts
- **Dark/Light Theme**: Toggle between themes with system preference detection

### Social Features
- **Comments**: Engage with public posts through comments
- **Reactions**: Like posts to show appreciation
- **Save Posts**: Bookmark interesting posts for later
- **User Profiles**: View user profiles and their public thoughts
- **Category Filtering**: Filter posts by categories (General, Life, Questions, Fun/Random, Creative, Thoughts)
- **Share Posts**: Share posts via native sharing or copy link

### Note Management
- **Word Count**: Track word count with limits for public posts (300 words)
- **Categories**: Categorize notes for better organization
- **Edit & Delete**: Full CRUD operations for notes and folders
- **Recent Activity**: View your most recently updated notes on the dashboard
- **Statistics Dashboard**: Track total notes, folders, and public posts

### User Experience
- **Responsive Design**: Fully responsive design for mobile, tablet, and desktop
- **Protected Routes**: Secure routes that require authentication
- **Real-time Updates**: Live updates using Supabase real-time features
- **Smooth Animations**: Polished UI with smooth transitions and hover effects
- **Navigation**: Intuitive sidebar navigation with active state indicators

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.11.0** - Client-side routing
- **Redux Toolkit 2.11.2** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **React Quill New 3.7.0** - Rich text editor
- **Axios 1.13.2** - HTTP client
- **Font Awesome 6.5.1** - Icon library

### Backend & Database
- **Supabase 2.89.0** - Backend as a Service (Database, Auth, Storage)
- **JSON Server 1.0.0-beta.3** - Mock REST API (optional, for development)

### Development Tools
- **ESLint 9.39.1** - Code linting
- **TypeScript Types** - Type definitions for React

## 📁 Project Structure

```
NotePad/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── _redirects      # Netlify redirects configuration
│   │   └── vite.svg         # Vite logo
│   ├── src/
│   │   ├── assets/          # Images and static files
│   │   ├── components/      # React components
│   │   │   ├── AccountPage.jsx
│   │   │   ├── CommentModal.jsx
│   │   │   ├── CreateNote.jsx
│   │   │   ├── DashBoard.jsx
│   │   │   ├── EditComponent.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── FolderModal.jsx
│   │   │   ├── Folders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── NoteModal.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SavedNotes.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Welcome.jsx
│   │   ├── context/         # React Context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── store/           # Redux store configuration
│   │   │   ├── authSlice.js
│   │   │   └── index.js
│   │   ├── App.jsx          # Main app component with routes
│   │   ├── authListener.js  # Supabase auth state listener
│   │   ├── main.jsx         # Application entry point
│   │   ├── supabaseClient.js # Supabase client configuration
│   │   └── index.css        # Global styles
│   ├── eslint.config.js     # ESLint configuration
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── README.md            # Frontend-specific README
├── backend/                  # Optional JSON server backend
│   ├── package.json         # Backend dependencies
│   └── db.json              # Mock database (if using JSON server)
├── package.json              # Root package.json
└── README.md                # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **Git**
- **Supabase Account** (free tier works fine)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NotePad
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install backend dependencies (optional, if using JSON server)**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🔐 Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to Get Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**
5. Paste them into your `.env` file

## 🏃 Running the Application

### Development Mode

1. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port Vite assigns)

2. **Start the backend server (optional, only if using JSON server)**
   ```bash
   cd backend
   npm start
   ```
   The JSON server will run on `http://localhost:3000`

### Build for Production

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```
   The production build will be in `frontend/dist`

2. **Preview the production build**
   ```bash
   cd frontend
   npm run preview
   ```

### Linting

Run ESLint to check for code issues:
```bash
cd frontend
npm run lint
```

## 📖 Usage Guide

### Getting Started

1. **Register/Login**: Create a new account or log in with existing credentials
2. **Dashboard**: View your statistics and recent activity
3. **Create Notes**: Click "Add Note" to create private notes or "Add Post" for public posts
4. **Organize**: Create folders to organize your notes
5. **Explore**: Browse the public feed to see what others are sharing

### Creating Notes

- **Private Notes**: Create personal notes that only you can see
- **Public Posts**: Share your thoughts with the community (300-word limit)
- **Rich Text**: Use the editor toolbar to format your content
- **Categories**: Assign categories to organize your content
- **Folders**: Assign notes to folders for better organization

### Managing Folders

- **Create Folders**: Click "New Folder" to create custom folders
- **Edit Folders**: Hover over folders to see edit/delete options
- **Organize Notes**: Assign notes to folders when creating or editing
- **Uncategorized**: Notes without folders appear in "Uncategorized"

### Public Feed Features

- **Browse Posts**: View all public posts from the community
- **Filter by Category**: Use category pills to filter posts
- **Search**: Use the search bar to find specific posts
- **Interact**: Like, comment, and save posts
- **View Profiles**: Click on usernames to view user profiles
- **Share**: Share posts using the share button

### Saved Notes

- Access your saved posts from the "Saved" section in navigation
- Remove saves by clicking the bookmark icon again

## 🗄 Database Setup

### Supabase Tables

You'll need to create the following tables in your Supabase project:

#### 1. **notes** table
```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  visibility TEXT DEFAULT 'Private' CHECK (visibility IN ('Private', 'Public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. **folders** table
```sql
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'fa-folder',
  color TEXT DEFAULT 'text-blue-400',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. **profiles** table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. **reactions** table
```sql
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);
```

#### 5. **saves** table
```sql
CREATE TABLE saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);
```

#### 6. **comments** table
```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

Enable RLS on all tables and create policies:

#### Notes Policies
```sql
-- Users can read their own notes
CREATE POLICY "Users can read own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read public notes
CREATE POLICY "Public notes are viewable by everyone" ON notes
  FOR SELECT USING (visibility = 'Public');

-- Users can insert their own notes
CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);
```

#### Folders Policies
```sql
-- Users can manage their own folders
CREATE POLICY "Users can manage own folders" ON folders
  FOR ALL USING (auth.uid() = user_id);
```

#### Profiles Policies
```sql
-- Profiles are viewable by everyone
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### Reactions, Saves, Comments Policies
```sql
-- Similar policies for reactions, saves, and comments
-- Users can read all, but only manage their own
```

### Database Functions

Create a function to automatically create a profile when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🚢 Deployment

### Deploying to Netlify

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`
   - Add environment variables in Netlify dashboard

3. **Configure Redirects**
   - The `_redirects` file in `frontend/public` handles SPA routing

### Deploying to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Add Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel dashboard

### Other Platforms

The app can be deployed to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any CDN that supports SPAs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [React](https://react.dev) team for the incredible framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [React Quill](https://github.com/zenoamaro/react-quill) for the rich text editor

---

**Made with love using React and Supabase**
