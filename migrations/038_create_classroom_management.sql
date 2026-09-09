CREATE TABLE academic_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE academic_classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL REFERENCES academic_buildings(id) ON DELETE CASCADE,
  name text NOT NULL,
  floor integer NOT NULL, -- 0 for Ground, 1 for 1st, 2 for 2nd, etc.
  capacity integer NOT NULL DEFAULT 40,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE (building_id, name)
);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE academic_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_classrooms ENABLE ROW LEVEL SECURITY;

-- Create policies for public read and authenticated mutations
CREATE POLICY "Allow public read on academic_buildings" ON academic_buildings
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin all on academic_buildings" ON academic_buildings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on academic_classrooms" ON academic_classrooms
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin all on academic_classrooms" ON academic_classrooms
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
