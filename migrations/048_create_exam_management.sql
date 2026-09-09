-- 048_create_exam_management.sql

-- 1. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- e.g., "First Term Examination 2026"
    session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, ongoing, completed, published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for exams
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all on exams"
    ON exams FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users on exams"
    ON exams FOR ALL USING (auth.role() = 'authenticated');

-- 2. Exam Schedules Table
CREATE TABLE IF NOT EXISTS exam_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_id UUID REFERENCES academic_classrooms(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for exam_schedules
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all on exam_schedules"
    ON exam_schedules FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users on exam_schedules"
    ON exam_schedules FOR ALL USING (auth.role() = 'authenticated');

-- 3. Grade Scales Table
CREATE TABLE IF NOT EXISTS grade_scales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for grade_scales
ALTER TABLE grade_scales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all on grade_scales"
    ON grade_scales FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users on grade_scales"
    ON grade_scales FOR ALL USING (auth.role() = 'authenticated');

-- 4. Grade Scale Details Table
CREATE TABLE IF NOT EXISTS grade_scale_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_scale_id UUID REFERENCES grade_scales(id) ON DELETE CASCADE,
    grade_letter VARCHAR(10) NOT NULL,
    grade_point NUMERIC(4,2) NOT NULL,
    min_percentage NUMERIC(5,2) NOT NULL,
    max_percentage NUMERIC(5,2) NOT NULL,
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for grade_scale_details
ALTER TABLE grade_scale_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all on grade_scale_details"
    ON grade_scale_details FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users on grade_scale_details"
    ON grade_scale_details FOR ALL USING (auth.role() = 'authenticated');

-- 5. Add grade_scale_id to academic_class_configs
ALTER TABLE academic_class_configs 
ADD COLUMN IF NOT EXISTS grade_scale_id UUID REFERENCES grade_scales(id) ON DELETE SET NULL;
