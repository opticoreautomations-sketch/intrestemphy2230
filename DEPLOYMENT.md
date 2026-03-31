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

## 4. Vercel Deployment

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variables (e.g., `JWT_SECRET`).
4. Deploy!

**Note on Vercel Persistence:**
- This app uses SQLite for simplicity. On Vercel, the database is stored in `/tmp`, which is **ephemeral**. Data will be lost when the serverless function restarts.
- Uploaded files are also stored in `/tmp` and will be lost.
- For production, it is highly recommended to use **Supabase** (as described above) for both the database and file storage.
