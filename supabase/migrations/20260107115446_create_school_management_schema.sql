/*
  # Infogate Schools Management System Database Schema

  ## Overview
  Complete database schema for a multi-role school management system supporting:
  - Admin, Teacher, Student, and Parent roles
  - Student and teacher management
  - Class and subject organization
  - Assignment creation and submission
  - Attendance tracking
  - Announcements and events
  - Timetable management
  - Grade tracking

  ## New Tables

  1. **profiles**
     - Extends auth.users with role and profile information
     - `id` (uuid, references auth.users)
     - `role` (text: admin, teacher, student, parent)
     - `full_name` (text)
     - `avatar_url` (text)
     - `phone` (text)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  2. **students**
     - Student-specific information
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles)
     - `admission_number` (text, unique)
     - `class_id` (uuid, references classes)
     - `date_of_birth` (date)
     - `gender` (text)
     - `address` (text)
     - `emergency_contact` (text)
     - `admission_date` (date)
     - `status` (text: active, inactive, graduated)

  3. **teachers**
     - Teacher-specific information
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles)
     - `employee_id` (text, unique)
     - `specialization` (text)
     - `date_of_joining` (date)
     - `qualification` (text)
     - `status` (text: active, inactive)

  4. **parents**
     - Parent-specific information
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles)
     - `occupation` (text)
     - `relationship` (text: father, mother, guardian)

  5. **student_parents**
     - Links students to their parents
     - `student_id` (uuid, references students)
     - `parent_id` (uuid, references parents)

  6. **classes**
     - Class/grade levels
     - `id` (uuid, primary key)
     - `name` (text: e.g., "Nursery 1", "Primary 3", "JSS 1")
     - `level` (text: nursery, primary, secondary, vocational)
     - `capacity` (integer)
     - `class_teacher_id` (uuid, references teachers)
     - `academic_year` (text)

  7. **subjects**
     - Academic subjects
     - `id` (uuid, primary key)
     - `name` (text)
     - `code` (text, unique)
     - `description` (text)
     - `level` (text: nursery, primary, secondary, vocational)

  8. **class_subjects**
     - Links classes to subjects with assigned teachers
     - `id` (uuid, primary key)
     - `class_id` (uuid, references classes)
     - `subject_id` (uuid, references subjects)
     - `teacher_id` (uuid, references teachers)

  9. **assignments**
     - Assignments created by teachers
     - `id` (uuid, primary key)
     - `title` (text)
     - `description` (text)
     - `class_subject_id` (uuid, references class_subjects)
     - `teacher_id` (uuid, references teachers)
     - `due_date` (timestamptz)
     - `total_marks` (integer)
     - `attachment_url` (text)
     - `created_at` (timestamptz)

  10. **assignment_submissions**
      - Student assignment submissions
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, references assignments)
      - `student_id` (uuid, references students)
      - `submission_text` (text)
      - `attachment_url` (text)
      - `submitted_at` (timestamptz)
      - `marks_obtained` (integer)
      - `feedback` (text)
      - `graded_at` (timestamptz)
      - `status` (text: pending, submitted, graded)

  11. **attendance**
      - Daily attendance records
      - `id` (uuid, primary key)
      - `student_id` (uuid, references students)
      - `class_id` (uuid, references classes)
      - `date` (date)
      - `status` (text: present, absent, late, excused)
      - `marked_by` (uuid, references teachers)
      - `remarks` (text)
      - `created_at` (timestamptz)

  12. **announcements**
      - School-wide announcements
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `created_by` (uuid, references profiles)
      - `target_audience` (text[]: admin, teacher, student, parent)
      - `priority` (text: low, medium, high)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)

  13. **events**
      - School events and calendar
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `location` (text)
      - `created_by` (uuid, references profiles)
      - `target_audience` (text[])
      - `created_at` (timestamptz)

  14. **timetable**
      - Class schedules
      - `id` (uuid, primary key)
      - `class_subject_id` (uuid, references class_subjects)
      - `day_of_week` (integer: 1-5 for Mon-Fri)
      - `start_time` (time)
      - `end_time` (time)
      - `room_number` (text)

  15. **grades**
      - Academic performance records
      - `id` (uuid, primary key)
      - `student_id` (uuid, references students)
      - `class_subject_id` (uuid, references class_subjects)
      - `term` (text: first, second, third)
      - `academic_year` (text)
      - `assessment_type` (text: test, exam, assignment)
      - `marks_obtained` (integer)
      - `total_marks` (integer)
      - `grade` (text)
      - `remarks` (text)
      - `recorded_at` (timestamptz)

  16. **teacher_attendance**
      - Teacher attendance tracking
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references teachers)
      - `date` (date)
      - `status` (text: present, absent, late, on_leave)
      - `check_in_time` (timestamptz)
      - `check_out_time` (timestamptz)
      - `remarks` (text)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for each role ensuring proper data access
  - Admin has full access
  - Teachers access their classes and students
  - Students access their own data
  - Parents access their children's data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  admission_number text UNIQUE NOT NULL,
  class_id uuid,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female')),
  address text,
  emergency_contact text,
  admission_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at timestamptz DEFAULT now()
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  specialization text,
  date_of_joining date DEFAULT CURRENT_DATE,
  qualification text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  occupation text,
  relationship text CHECK (relationship IN ('father', 'mother', 'guardian')),
  created_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level text NOT NULL CHECK (level IN ('nursery', 'primary', 'secondary', 'vocational')),
  capacity integer DEFAULT 30,
  class_teacher_id uuid,
  academic_year text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key for students.class_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'students_class_id_fkey'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_class_id_fkey 
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add foreign key for classes.class_teacher_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'classes_class_teacher_id_fkey'
  ) THEN
    ALTER TABLE classes ADD CONSTRAINT classes_class_teacher_id_fkey 
      FOREIGN KEY (class_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create student_parents junction table
CREATE TABLE IF NOT EXISTS student_parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, parent_id)
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  level text NOT NULL CHECK (level IN ('nursery', 'primary', 'secondary', 'vocational')),
  created_at timestamptz DEFAULT now()
);

-- Create class_subjects table
CREATE TABLE IF NOT EXISTS class_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, subject_id)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  class_subject_id uuid REFERENCES class_subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  due_date timestamptz NOT NULL,
  total_marks integer DEFAULT 100,
  attachment_url text,
  created_at timestamptz DEFAULT now()
);

-- Create assignment_submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  submission_text text,
  attachment_url text,
  submitted_at timestamptz DEFAULT now(),
  marks_obtained integer,
  feedback text,
  graded_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
  UNIQUE(assignment_id, student_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  remarks text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  target_audience text[] DEFAULT '{}',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time,
  end_time time,
  location text,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  target_audience text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create timetable table
CREATE TABLE IF NOT EXISTS timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_subject_id uuid REFERENCES class_subjects(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),
  start_time time NOT NULL,
  end_time time NOT NULL,
  room_number text,
  created_at timestamptz DEFAULT now()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_subject_id uuid REFERENCES class_subjects(id) ON DELETE CASCADE,
  term text NOT NULL CHECK (term IN ('first', 'second', 'third')),
  academic_year text NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('test', 'exam', 'assignment')),
  marks_obtained integer NOT NULL,
  total_marks integer NOT NULL,
  grade text,
  remarks text,
  recorded_at timestamptz DEFAULT now()
);

-- Create teacher_attendance table
CREATE TABLE IF NOT EXISTS teacher_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
  check_in_time timestamptz,
  check_out_time timestamptz,
  remarks text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, date)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_attendance ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Students policies
CREATE POLICY "Admins can manage all students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can view students in their classes"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN teachers t ON t.user_id = p.id
      JOIN class_subjects cs ON cs.teacher_id = t.id
      WHERE p.id = auth.uid() AND cs.class_id = students.class_id
    ) OR EXISTS (
      SELECT 1 FROM profiles p
      JOIN teachers t ON t.user_id = p.id
      JOIN classes c ON c.class_teacher_id = t.id
      WHERE p.id = auth.uid() AND c.id = students.class_id
    )
  );

CREATE POLICY "Students can view own record"
  ON students FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.user_id = auth.uid() AND sp.student_id = students.id
    )
  );

-- Teachers policies
CREATE POLICY "Admins can manage all teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can view own record"
  ON teachers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "All authenticated users can view teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (true);

-- Parents policies
CREATE POLICY "Admins can manage all parents"
  ON parents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Parents can view own record"
  ON parents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Student-parents policies
CREATE POLICY "Admins can manage student-parent relationships"
  ON student_parents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Parents can view their relationships"
  ON student_parents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parents
      WHERE user_id = auth.uid() AND id = parent_id
    )
  );

-- Classes policies
CREATE POLICY "Admins can manage all classes"
  ON classes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

-- Subjects policies
CREATE POLICY "Admins can manage all subjects"
  ON subjects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Class subjects policies
CREATE POLICY "Admins can manage class subjects"
  ON class_subjects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can view class subjects"
  ON class_subjects FOR SELECT
  TO authenticated
  USING (true);

-- Assignments policies
CREATE POLICY "Teachers can manage their assignments"
  ON assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE user_id = auth.uid() AND id = teacher_id
    )
  );

CREATE POLICY "Admins can view all assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can view assignments for their class"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN class_subjects cs ON cs.class_id = s.class_id
      WHERE s.user_id = auth.uid() AND cs.id = assignments.class_subject_id
    )
  );

CREATE POLICY "Parents can view assignments for their children's classes"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      JOIN students s ON s.id = sp.student_id
      JOIN class_subjects cs ON cs.class_id = s.class_id
      WHERE p.user_id = auth.uid() AND cs.id = assignments.class_subject_id
    )
  );

-- Assignment submissions policies
CREATE POLICY "Students can manage own submissions"
  ON assignment_submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = student_id
    )
  );

CREATE POLICY "Teachers can view and grade submissions for their assignments"
  ON assignment_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN teachers t ON t.id = a.teacher_id
      WHERE t.user_id = auth.uid() AND a.id = assignment_id
    )
  );

CREATE POLICY "Teachers can update submissions for grading"
  ON assignment_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN teachers t ON t.id = a.teacher_id
      WHERE t.user_id = auth.uid() AND a.id = assignment_id
    )
  );

CREATE POLICY "Parents can view their children's submissions"
  ON assignment_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.user_id = auth.uid() AND sp.student_id = student_id
    )
  );

CREATE POLICY "Admins can view all submissions"
  ON assignment_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attendance policies
CREATE POLICY "Teachers can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers t
      JOIN classes c ON c.class_teacher_id = t.id OR c.id IN (
        SELECT DISTINCT cs.class_id FROM class_subjects cs WHERE cs.teacher_id = t.id
      )
      WHERE t.user_id = auth.uid() AND c.id = class_id
    )
  );

CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = student_id
    )
  );

CREATE POLICY "Parents can view their children's attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.user_id = auth.uid() AND sp.student_id = student_id
    )
  );

CREATE POLICY "Admins can manage all attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Announcements policies
CREATE POLICY "Admins can manage all announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Users can view announcements for their role"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = ANY(target_audience)
    ) OR target_audience = '{}'
  );

-- Events policies
CREATE POLICY "Admins can manage all events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Users can view events for their role"
  ON events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = ANY(target_audience)
    ) OR target_audience = '{}'
  );

-- Timetable policies
CREATE POLICY "Admins can manage all timetable"
  ON timetable FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can view timetable"
  ON timetable FOR SELECT
  TO authenticated
  USING (true);

-- Grades policies
CREATE POLICY "Teachers can manage grades for their subjects"
  ON grades FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_subjects cs
      JOIN teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid() AND cs.id = class_subject_id
    )
  );

CREATE POLICY "Students can view own grades"
  ON grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = student_id
    )
  );

CREATE POLICY "Parents can view their children's grades"
  ON grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.user_id = auth.uid() AND sp.student_id = student_id
    )
  );

CREATE POLICY "Admins can manage all grades"
  ON grades FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Teacher attendance policies
CREATE POLICY "Admins can manage teacher attendance"
  ON teacher_attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can view own attendance"
  ON teacher_attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE user_id = auth.uid() AND id = teacher_id
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_parents_user_id ON parents(user_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent_id ON student_parents(parent_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_teacher_id ON class_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class_subject_id ON assignments(class_subject_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);