import mongoose from 'mongoose';
import User from './models/User';
import Teacher from './models/Teacher';
import TeacherAttendance from './models/TeacherAttendance';

mongoose.connect('mongodb+srv://infogate:infogate@infogate.ulyf2ah.mongodb.net/infogate')
  .then(async () => {
    try {
        // init model
        User.findOne({});
        const teachers = await Teacher.find().populate('user_id');
        
        const teacherData = await Promise.all(teachers.map(async (t) => {
            const marked = await TeacherAttendance.countDocuments({ teacher_id: t._id });
            const present = await TeacherAttendance.countDocuments({ 
                teacher_id: t._id, 
                status: { $in: ['present', 'late'] } 
            });
            const rate = marked > 0 ? Math.round((present / marked) * 100) : 0;

            return {
                name: (t.user_id as any)?.full_name || 'Unknown',
                specialization: t.specialization,
                attendance: marked > 0 ? `${rate}%` : 'No Data'
            };
        }));
        console.log(JSON.stringify({ teachers: teacherData }, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
      process.exit();
    }
  });
