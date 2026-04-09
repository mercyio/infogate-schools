import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Parent from '../models/Parent';
import Class from '../models/Class';
import ClassSubject from '../models/ClassSubject';
import Subject from '../models/Subject';

const generateRegNumber = async (role: string): Promise<string> => {
    const rolePrefix: Record<string, string> = {
        student: 'STU',
        teacher: 'TEA',
        parent: 'PAR',
        admin: 'ADM',
    };
    const prefix = rolePrefix[role] || role.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const count = await User.countDocuments({ role });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `IG/${year}/${prefix}-${sequence}`;
};

const generateRandomPassword = (): string => {
    return Math.random().toString(36).slice(-8);
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const { class_id } = req.query;
        const filter: any = {};
        if (class_id) filter.class_id = class_id;

        const students = await Student.find(filter)
            .populate({
                path: 'user_id',
                select: '-passwordHash',
                match: { role: 'student' }
            })
            .populate('class_id');
        
        const realStudents = students.filter(student => student.user_id);
        res.json(realStudents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeachers = async (req: Request, res: Response): Promise<void> => {
    try {
        const teachers = await Teacher.find()
            .populate('user_id', '-passwordHash')
            .populate('assigned_class');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getParents = async (req: Request, res: Response): Promise<void> => {
    try {
        const parents = await Parent.find().populate('user_id', '-passwordHash');
        res.json(parents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            full_name, email, phone, class_id, date_of_birth, gender, address, emergency_contact,
            program, grade, parent_name, parent_email, parent_phone, medical_info
        } = req.body;

        const reg_number = await generateRegNumber('student');
        const password = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            reg_number,
            email,
            passwordHash,
            password, // Store plain text for admin visibility
            role: 'student',
            full_name,
            phone,
        });

        const student = await Student.create({
            user_id: user._id,
            admission_number: reg_number,
            class_id,
            date_of_birth,
            gender,
            address,
            emergency_contact,
            program,
            grade,
            parent_name,
            parent_email,
            parent_phone,
            medical_info
        });

        res.status(201).json({
            message: 'Student created successfully',
            credentials: { reg_number, password },
            student
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, phone, role, assigned_class, assigned_subject, experience, address, qualification, specialization } = req.body;

        const reg_number = await generateRegNumber('teacher');
        const password = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            reg_number,
            email,
            passwordHash,
            password, // Store plain text for admin visibility
            role: 'teacher',
            full_name,
            phone,
        });

        const teacher = await Teacher.create({
            user_id: user._id,
            employee_id: reg_number,
            role,
            assigned_class: assigned_class || null,
            assigned_subject,
            experience,
            address,
            qualification,
            specialization
        });

        // Link class to teacher if assigned
        if (assigned_class) {
            await Class.findByIdAndUpdate(assigned_class, { class_teacher_id: teacher._id });
        }

        res.status(201).json({
            message: 'Teacher created successfully',
            credentials: { reg_number, password },
            teacher
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createParent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, phone, occupation, relationship } = req.body;

        const reg_number = await generateRegNumber('parent');
        const password = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            reg_number,
            email,
            passwordHash,
            password, // Store plain text for admin visibility
            role: 'parent',
            full_name,
            phone,
        });

        const parent = await Parent.create({
            user_id: user._id,
            occupation,
            relationship
        });

        res.status(201).json({
            message: 'Parent created successfully',
            credentials: { reg_number, password },
            parent
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id).populate('user_id', '-passwordHash').populate('class_id');
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }

        const { 
            full_name, email, phone, class_id, date_of_birth, gender, address, emergency_contact, status,
            program, grade, parent_name, parent_email, parent_phone, medical_info 
        } = req.body;

        await User.findByIdAndUpdate(student.user_id, { full_name, email, phone }, { new: true });

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
            class_id, date_of_birth, gender, address, emergency_contact, status,
            program, grade, parent_name, parent_email, parent_phone, medical_info
        }, { new: true }).populate('user_id', '-passwordHash').populate('class_id');

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }

        await User.findByIdAndDelete(student.user_id);
        await Student.findByIdAndDelete(req.params.id);

        res.json({ message: 'Student and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('user_id', '-passwordHash');
        if (!teacher) { res.status(404).json({ message: 'Teacher not found' }); return; }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) { res.status(404).json({ message: 'Teacher not found' }); return; }

        const { full_name, email, phone, role, assigned_class, assigned_subject, experience, address, qualification, specialization, status } = req.body;

        const oldAssignedClass = teacher.assigned_class;

        await User.findByIdAndUpdate(teacher.user_id, { full_name, email, phone }, { new: true });

        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, {
            role, 
            assigned_class: assigned_class || null, 
            assigned_subject, 
            experience, 
            address, 
            qualification, 
            specialization, 
            status
        }, { new: true })
        .populate('user_id', '-passwordHash')
        .populate('assigned_class');

        // Handing class synchronization
        if (assigned_class && String(assigned_class) !== String(oldAssignedClass)) {
            // Unlink old class
            if (oldAssignedClass) {
                await Class.findByIdAndUpdate(oldAssignedClass, { class_teacher_id: null });
            }
            // Link new class
            await Class.findByIdAndUpdate(assigned_class, { class_teacher_id: teacher._id });
        } else if (!assigned_class && oldAssignedClass) {
            // Unlink if class assignment was removed
            await Class.findByIdAndUpdate(oldAssignedClass, { class_teacher_id: null });
        }

        res.json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) { res.status(404).json({ message: 'Teacher not found' }); return; }

        await User.findByIdAndDelete(teacher.user_id);
        await Teacher.findByIdAndDelete(req.params.id);

        res.json({ message: 'Teacher and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getParentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const parent = await Parent.findById(req.params.id).populate('user_id', '-passwordHash');
        if (!parent) { res.status(404).json({ message: 'Parent not found' }); return; }
        res.json(parent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateParent = async (req: Request, res: Response): Promise<void> => {
    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) { res.status(404).json({ message: 'Parent not found' }); return; }

        const { full_name, email, phone, occupation, relationship } = req.body;

        await User.findByIdAndUpdate(parent.user_id, { full_name, email, phone }, { new: true });

        const updatedParent = await Parent.findByIdAndUpdate(req.params.id, {
            occupation, relationship
        }, { new: true }).populate('user_id', '-passwordHash');

        res.json(updatedParent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteParent = async (req: Request, res: Response): Promise<void> => {
    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) { res.status(404).json({ message: 'Parent not found' }); return; }

        await User.findByIdAndDelete(parent.user_id);
        await Parent.findByIdAndDelete(req.params.id);

        res.json({ message: 'Parent and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getMeTeacher = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findOne({ user_id: req.user.id }).populate('user_id', '-passwordHash').populate('assigned_class');
        if (!teacher) {
            res.status(404).json({ message: 'Teacher profile not found' });
            return;
        }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeacherStudentsGrouped = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const classSubjectFilter: any = {};
        let teacherProfile: any = null;

        if (req.user?.role === 'teacher') {
            teacherProfile = await Teacher.findOne({ user_id: req.user.id }).populate('assigned_class');
            if (!teacherProfile) {
                res.status(404).json({ message: 'Teacher profile not found' });
                return;
            }
            classSubjectFilter.teacher_id = teacherProfile._id;
        }

        if (req.user?.role === 'admin' && req.query.teacher_id) {
            classSubjectFilter.teacher_id = req.query.teacher_id;
            teacherProfile = await Teacher.findById(req.query.teacher_id).populate('assigned_class');
        }

        // Find ClassSubject records for current teacher (or all for admin)
        const classSubjects = await ClassSubject.find(classSubjectFilter)
            .populate({
                path: 'class_id',
                select: 'name level academic_year'
            })
            .populate({
                path: 'subject_id',
                select: 'name code'
            });

        const groupedDataMap = new Map<string, any>();

        const addGroup = (classData: any, subjectData: any, students: any[]) => {
            const classId = String(classData?._id);
            const subjectId = String(subjectData?._id || subjectData?.name || 'class-teacher');
            const key = `${classId}:${subjectId}`;

            if (!groupedDataMap.has(key)) {
                groupedDataMap.set(key, {
                    class: {
                        _id: classData?._id,
                        name: classData?.name,
                        level: classData?.level,
                        academic_year: classData?.academic_year
                    },
                    subject: {
                        _id: subjectData?._id,
                        name: subjectData?.name || 'Class Teacher',
                        code: subjectData?.code
                    },
                    students: [] as any[]
                });
            }

            const group = groupedDataMap.get(key);
            group.students = students;
        };

        // Extract unique class IDs from subject assignments
        const classIds = classSubjects
            .map(cs => cs.class_id as any)
            .filter(Boolean)
            .map(c => c._id);

        // Also include the teacher's directly assigned class, if present
        const assignedClassId = teacherProfile?.assigned_class?._id || teacherProfile?.assigned_class;
        if (assignedClassId) {
            classIds.push(assignedClassId);
        }

        const uniqueClassIds = [...new Set(classIds.map(id => String(id)))];

        // Get all students for these classes
        const students = await Student.find({ class_id: { $in: uniqueClassIds } })
            .populate({
                path: 'user_id',
                select: '-passwordHash',
                match: { role: 'student' }
            })
            .populate('class_id');

        // Filter out students without valid user data
        const validStudents = students.filter(student => student.user_id);

        // Group students by class and subject
        classSubjects.forEach(classSubject => {
            const classData = classSubject.class_id as any;
            const subjectData = classSubject.subject_id as any;

            const classStudents = validStudents.filter(
                student => String((student.class_id as any)?._id) === String(classData?._id)
            );

            addGroup(classData, subjectData, classStudents);
        });

        // If the teacher has a direct assigned class without a matching ClassSubject, add it as a class-teacher group.
        if (teacherProfile?.assigned_class) {
            const assignedClassData = teacherProfile.assigned_class as any;
            const assignedStudents = validStudents.filter(
                student => String((student.class_id as any)?._id) === String(assignedClassData?._id)
            );

            addGroup(assignedClassData, { name: teacherProfile.assigned_subject || 'Class Teacher' }, assignedStudents);
        }

        const groupedData = Array.from(groupedDataMap.values()).map(group => ({
            ...group,
            students: (group.students || []).map((student: any) => {
                const userData = student.user_id as any;
                const classInfo = student.class_id as any;

                return {
                    _id: student._id,
                    admission_number: student.admission_number,
                    user: {
                        _id: userData?._id,
                        full_name: userData?.full_name,
                        email: userData?.email,
                        phone: userData?.phone,
                        reg_number: userData?.reg_number
                    },
                    class_id: classInfo?._id,
                    gender: student.gender,
                    date_of_birth: student.date_of_birth,
                    contact_number: (student as any)?.contact_number,
                    emergency_contact: student.emergency_contact,
                    parent_name: student.parent_name,
                    parent_email: student.parent_email,
                    parent_phone: student.parent_phone
                };
            })
        }));

        res.json(groupedData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const recordStudentPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }

        const { amount, method, reference, description } = req.body;
        
        let newPaidFees = (student.paid_fees || 0) + Number(amount);
        
        const payment = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date(),
            amount: Number(amount),
            method,
            reference,
            description
        };

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
            $set: { paid_fees: newPaidFees },
            $push: { payment_history: payment }
        }, { new: true }).populate('user_id', '-passwordHash').populate('class_id');

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
