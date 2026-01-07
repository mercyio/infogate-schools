export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AssignmentStatus = 'pending' | 'submitted' | 'graded';

export type StudentStatus = 'active' | 'inactive' | 'graduated';

export type TeacherStatus = 'active' | 'inactive';

export type SchoolLevel = 'nursery' | 'primary' | 'secondary' | 'vocational';

export type Term = 'first' | 'second' | 'third';

export type AssessmentType = 'test' | 'exam' | 'assignment';

export type Priority = 'low' | 'medium' | 'high';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  admission_number: string;
  class_id?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  address?: string;
  emergency_contact?: string;
  admission_date: string;
  status: StudentStatus;
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  employee_id: string;
  specialization?: string;
  date_of_joining: string;
  qualification?: string;
  status: TeacherStatus;
  created_at: string;
}

export interface Parent {
  id: string;
  user_id: string;
  occupation?: string;
  relationship?: 'father' | 'mother' | 'guardian';
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  level: SchoolLevel;
  capacity: number;
  class_teacher_id?: string;
  academic_year: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  level: SchoolLevel;
  created_at: string;
}

export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id?: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  class_subject_id: string;
  teacher_id: string;
  due_date: string;
  total_marks: number;
  attachment_url?: string;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text?: string;
  attachment_url?: string;
  submitted_at: string;
  marks_obtained?: number;
  feedback?: string;
  graded_at?: string;
  status: AssignmentStatus;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: AttendanceStatus;
  marked_by?: string;
  remarks?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by: string;
  target_audience: UserRole[];
  priority: Priority;
  created_at: string;
  expires_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  created_by: string;
  target_audience: UserRole[];
  created_at: string;
}

export interface Timetable {
  id: string;
  class_subject_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  created_at: string;
}

export interface Grade {
  id: string;
  student_id: string;
  class_subject_id: string;
  term: Term;
  academic_year: string;
  assessment_type: AssessmentType;
  marks_obtained: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
  recorded_at: string;
}

export interface TeacherAttendance {
  id: string;
  teacher_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
  created_at: string;
}
