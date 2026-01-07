# Setup Guide for Infogate Schools

## Quick Start

The application is already configured with all necessary environment variables and database schema.

## Demo Accounts

To test the application, you'll need to create demo user accounts in Supabase. Here are the credentials shown on the login page:

### Creating Demo Users

You can create demo users through the Supabase dashboard or use the following SQL to insert test data:

```sql
-- Note: You'll need to create users through Supabase Auth first, then link them to profiles

-- After creating auth users, insert profiles:

-- Admin Profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('YOUR_ADMIN_USER_ID', 'admin', 'Admin User', '+234 800 000 0001');

-- Teacher Profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('YOUR_TEACHER_USER_ID', 'teacher', 'John Teacher', '+234 800 000 0002');

-- Student Profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('YOUR_STUDENT_USER_ID', 'student', 'Sarah Student', '+234 800 000 0003');

-- Parent Profile
INSERT INTO profiles (id, role, full_name, phone)
VALUES ('YOUR_PARENT_USER_ID', 'parent', 'Jane Parent', '+234 800 000 0004');
```

### Sample Classes

```sql
INSERT INTO classes (name, level, capacity, academic_year) VALUES
('Nursery 1', 'nursery', 20, '2023/2024'),
('Nursery 2', 'nursery', 20, '2023/2024'),
('Primary 1', 'primary', 30, '2023/2024'),
('Primary 2', 'primary', 30, '2023/2024'),
('Primary 3', 'primary', 30, '2023/2024'),
('Primary 4', 'primary', 30, '2023/2024'),
('Primary 5', 'primary', 30, '2023/2024'),
('Primary 6', 'primary', 30, '2023/2024'),
('JSS 1', 'secondary', 35, '2023/2024'),
('JSS 2', 'secondary', 35, '2023/2024'),
('JSS 3', 'secondary', 35, '2023/2024'),
('SSS 1', 'secondary', 35, '2023/2024'),
('SSS 2', 'secondary', 35, '2023/2024'),
('SSS 3', 'secondary', 35, '2023/2024');
```

### Sample Subjects

```sql
INSERT INTO subjects (name, code, level, description) VALUES
('Mathematics', 'MATH', 'primary', 'Basic mathematics and arithmetic'),
('English Language', 'ENG', 'primary', 'Reading, writing, and comprehension'),
('Science', 'SCI', 'primary', 'Basic science and nature studies'),
('Social Studies', 'SST', 'primary', 'Geography and history'),
('Arts', 'ART', 'primary', 'Creative arts and crafts'),
('Physical Education', 'PE', 'primary', 'Sports and physical activities');
```

## Database Structure

The database includes the following main tables:

1. **profiles** - User authentication and role management
2. **students** - Student information and records
3. **teachers** - Teacher information and qualifications
4. **parents** - Parent/guardian information
5. **classes** - Class/grade levels
6. **subjects** - Academic subjects
7. **class_subjects** - Subject assignments to classes with teachers
8. **assignments** - Homework and assignments
9. **assignment_submissions** - Student submissions
10. **attendance** - Daily student attendance
11. **teacher_attendance** - Teacher attendance
12. **grades** - Academic performance records
13. **announcements** - School-wide announcements
14. **events** - School calendar events
15. **timetable** - Class schedules

All tables have Row Level Security enabled with appropriate access policies for each role.

## Features by Role

### Admin
- Full system access
- Dashboard with analytics
- Student management
- Teacher management
- Class management
- Attendance oversight
- Academic performance monitoring

### Teacher
- Class management
- Attendance marking
- Assignment creation
- Grade submission
- Student progress tracking

### Student
- View assignments
- Submit work
- Check grades
- View attendance
- Access timetable

### Parent
- Monitor children
- View academic progress
- Check attendance
- See assignments
- Read announcements

## Development

The application runs automatically in development mode. No additional setup is required.

## Production Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Support

For any issues or questions, refer to the main README.md file.
