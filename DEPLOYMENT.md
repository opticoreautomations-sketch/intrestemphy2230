# Physics Platform Deployment Guide

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `supabase_schema.sql`.
3. Go to **Project Settings > API** and copy your `URL` and `anon key`.
4. Go to **Authentication > Providers > Email** and disable "Confirm email" for easier testing (optional).
5. Go to **Storage** and create a bucket named `materials` with public access (or restricted if you handle signed URLs).

## 2. Environment Variables

Add these to your Vercel project or local `.env`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_TEACHER_EMAIL=teacher@physics.com
```

## 3. Teacher Account

To make a user a teacher:
1. Sign up normally through the app.
2. Go to Supabase Dashboard > Table Editor > `profiles`.
3. Change the `role` of your user from `student` to `teacher`.

## 5. Render Deployment

1. Push your code to GitHub.
2. Go to [Render](https://render.com) and click **"New"** > **"Blueprint"**.
3. Connect your repository.
4. Render will automatically detect the `render.yaml` file and set up:
    - A **Web Service** for the app.
    - A **Persistent Disk** (1GB) to store your SQLite database and uploads.
5. Add any missing environment variables (like `JWT_SECRET` if you didn't generate it).
6. Deploy!

**Note on Render Persistence:**
- Unlike Vercel, Render supports **Persistent Disks**. Your data and uploads will survive restarts as long as the disk is mounted at `/var/data`.
