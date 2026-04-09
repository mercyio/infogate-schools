import express from 'express';
import {
    getStudents, getTeachers, getParents,
    createStudent, createTeacher, createParent,
    getStudentById, updateStudent, deleteStudent,
    getTeacherById, updateTeacher, deleteTeacher,
    getParentById, updateParent, deleteParent,
    getMeTeacher, recordStudentPayment, getTeacherStudentsGrouped
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Students
router.get('/students', protect, getStudents);
router.post('/students', protect, authorize('admin'), createStudent);
router.get('/students/:id', protect, getStudentById);
router.put('/students/:id', protect, authorize('admin'), updateStudent);
router.delete('/students/:id', protect, authorize('admin'), deleteStudent);
router.post('/students/:id/payments', protect, authorize('admin'), recordStudentPayment);

// Teachers
router.get('/teachers', protect, getTeachers);
router.post('/teachers', protect, authorize('admin'), createTeacher);
router.get('/teachers/:id', protect, getTeacherById);
router.put('/teachers/:id', protect, authorize('admin'), updateTeacher);
router.delete('/teachers/:id', protect, authorize('admin'), deleteTeacher);
router.get('/me/teacher', protect, authorize('teacher'), getMeTeacher);
router.get('/teacher/students/grouped', protect, authorize('teacher', 'admin'), getTeacherStudentsGrouped);

// Parents
router.get('/parents', protect, authorize('admin', 'teacher'), getParents);
router.post('/parents', protect, authorize('admin'), createParent);
router.get('/parents/:id', protect, authorize('admin', 'teacher'), getParentById);
router.put('/parents/:id', protect, authorize('admin'), updateParent);
router.delete('/parents/:id', protect, authorize('admin'), deleteParent);

export default router;
