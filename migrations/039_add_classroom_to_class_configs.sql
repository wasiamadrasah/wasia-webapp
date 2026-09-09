ALTER TABLE academic_class_configs
ADD COLUMN classroom_id uuid REFERENCES academic_classrooms(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_acc_classroom_id ON academic_class_configs (classroom_id);
