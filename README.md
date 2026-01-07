# Infogate Schools Management System

A comprehensive, child-friendly school management platform with multi-role portal system for nursery, primary, secondary, and vocational education.

## Features

### Public School Website
- Colorful and playful design with child-friendly illustrations
- Soft colors, rounded cards, and friendly typography
- Whimsical animations and transitions
- Pages: Home, About, Admissions, Events, and Contact
- Fully responsive design

### Role-Based Portal System

#### Admin Portal
- Comprehensive dashboard with analytics and charts
- Student enrollment trends and level distribution
- Average performance by subject
- Student, teacher, and class management
- Complete CRUD operations for all entities
- Attendance tracking and monitoring
- Real-time statistics

#### Teacher Portal
- Personal dashboard with class overview
- Daily schedule and timetable
- Attendance marking system
- Assignment creation and management
- Grade submission and feedback
- Student interaction tools

#### Student Portal
- Fun and motivating dashboard
- Assignment viewing and submission
- Personal attendance records
- Progress tracking with visual charts
- Timetable access
- Achievement badges

#### Parent Portal
- Multi-child monitoring
- Academic progress tracking
- Attendance reports
- Assignment status visibility
- Teacher feedback viewing
- Event calendar

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom child-friendly theme
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Routing**: React Router v6
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with role-based access
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Database Schema

The system includes comprehensive tables for:
- User profiles with role management
- Students, teachers, and parents
- Classes and subjects
- Class-subject teacher assignments
- Assignments and submissions
- Attendance tracking (students and teachers)
- Grades and academic records
- Announcements and events
- Timetable management

All tables have Row Level Security (RLS) enabled with appropriate policies for each role.

## Design Philosophy

### Child-Friendly Elements
- Playful color palette (soft blues, yellows, greens)
- Rounded corners and soft shadows
- Cartoon-style graphics and illustrations
- Friendly typography with Fredoka display font
- Large, accessible buttons
- Clear visual hierarchy
- Engaging animations and micro-interactions

### Accessibility
- High contrast ratios for readability
- Large touch targets for mobile devices
- Clear navigation structure
- Intuitive user interface
- Responsive design for all devices

## Getting Started

The application is already configured and ready to use. The development server starts automatically.

## Authentication

The system uses Supabase authentication with email/password. Users are assigned roles (admin, teacher, student, parent) that determine their access level and portal features.

## Security

- Row Level Security on all database tables
- Role-based access control
- Secure authentication flow
- Protected routes based on user roles
- Proper error handling

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/          # React contexts (Auth)
├── layouts/           # Layout components (Public, Dashboard)
├── lib/              # Library configurations (Supabase)
├── pages/            # All page components
│   ├── admin/       # Admin portal pages
│   ├── auth/        # Authentication pages
│   ├── parent/      # Parent portal pages
│   ├── public/      # Public website pages
│   ├── student/     # Student portal pages
│   └── teacher/     # Teacher portal pages
└── types/           # TypeScript type definitions
```

## Future Enhancements

- File upload for assignments
- Real-time notifications
- Video conferencing integration
- Mobile app version
- Advanced analytics and reporting
- Fee management system
- Library management
- Transport management
- Exam scheduling
- Report card generation

## License

This project is for educational purposes.
