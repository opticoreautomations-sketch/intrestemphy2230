-- Database Schema for Physics Platform

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Content table (stores links and video URLs)
CREATE TABLE IF NOT EXISTS public.content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT UNIQUE CHECK (type IN ('open', 'close')),
    video_url TEXT,
    goals_url TEXT,
    curriculum_url TEXT,
    first_test_url TEXT,
    second_test_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Progress table (tracks student engagement)
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type TEXT REFERENCES public.content(type),
    views INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Test Results table
CREATE TABLE IF NOT EXISTS public.test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_type TEXT CHECK (test_type IN ('first', 'second')),
    score NUMERIC,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Content Policies
CREATE POLICY "Content is viewable by authenticated users" ON public.content
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only teachers can modify content" ON public.content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- Progress Policies
CREATE POLICY "Users can view own progress" ON public.progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all progress" ON public.progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION increment_view_count(content_type_param TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.progress (student_id, content_type, views)
    VALUES (auth.uid(), content_type_param, 1)
    ON CONFLICT (student_id, content_type) 
    DO UPDATE SET views = public.progress.views + 1, last_accessed = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
