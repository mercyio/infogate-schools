import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import AssignmentSubmission from '../models/AssignmentSubmission';
import Teacher from '../models/Teacher';
import ClassSubject from '../models/ClassSubject';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const query: Record<string, unknown> = {};

        if (req.user?.role === 'teacher') {
            const teacherProfile = await Teacher.findOne({ user_id: req.user.id }).select('_id');
            if (!teacherProfile) {
                res.status(404).json({ message: 'Teacher profile not found' });
                return;
            }
            query.teacher_id = teacherProfile._id;
        }

        const assignments = await Assignment.find(query)
            .populate({
                path: 'class_subject_id',
                populate: [
                    { path: 'class_id', select: 'name level academic_year' },
                    { path: 'subject_id', select: 'name code' },
                ],
            })
            .populate({
                path: 'teacher_id',
                populate: { path: 'user_id', select: 'full_name email' },
            })
            .sort({ createdAt: -1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, class_subject_id, due_date, total_marks } = req.body;
        if (!title || !class_subject_id || !due_date || total_marks === undefined) {
            res.status(400).json({ message: 'title, class_subject_id, due_date and total_marks are required' });
            return;
        }

        const teacherProfile = await Teacher.findOne({ user_id: req.user.id }).select('_id');
        if (!teacherProfile) {
            res.status(404).json({ message: 'Teacher profile not found' });
            return;
        }

        const classSubject = await ClassSubject.findById(class_subject_id).select('teacher_id');
        if (!classSubject) {
            res.status(404).json({ message: 'Class-subject mapping not found' });
            return;
        }

        if (!classSubject.teacher_id || String(classSubject.teacher_id) !== String(teacherProfile._id)) {
            res.status(403).json({ message: 'You are not assigned to this class and subject' });
            return;
        }

        const assignment = await Assignment.create({
            title,
            description,
            class_subject_id,
            teacher_id: teacherProfile._id,
            due_date,
            total_marks,
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

export const getAdminAssignmentFeed = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignments = await Assignment.find()
            .populate({
                path: 'class_subject_id',
                populate: [
                    { path: 'class_id', select: 'name' },
                    { path: 'subject_id', select: 'name code' },
                ],
            })
            .populate({
                path: 'teacher_id',
                populate: { path: 'user_id', select: 'full_name email' },
            })
            .sort({ createdAt: -1 });

        const assignmentIds = assignments.map((assignment) => assignment._id);

        const submissions = await AssignmentSubmission.find({
            assignment_id: { $in: assignmentIds },
        })
            .populate({
                path: 'student_id',
                populate: { path: 'user_id', select: 'full_name email' },
            })
            .sort({ submitted_at: -1 });

        const submissionsByAssignment = new Map<string, any[]>();
        submissions.forEach((submission: any) => {
            const key = String(submission.assignment_id);
            const existing = submissionsByAssignment.get(key) || [];
            existing.push(submission);
            submissionsByAssignment.set(key, existing);
        });

        const feed = assignments.map((assignment: any) => {
            const assignmentSubmissions = submissionsByAssignment.get(String(assignment._id)) || [];

            const formattedSubmissions = assignmentSubmissions.map((submission: any) => ({
                _id: submission._id,
                status: submission.status,
                submission_text: submission.submission_text,
                attachment_url: submission.attachment_url,
                submitted_at: submission.submitted_at,
                marks_obtained: submission.marks_obtained,
                feedback: submission.feedback,
                graded_at: submission.graded_at,
                student: {
                    _id: submission.student_id?._id,
                    name: submission.student_id?.user_id?.full_name || 'Unknown Student',
                    email: submission.student_id?.user_id?.email,
                },
            }));

            const gradedCount = formattedSubmissions.filter((submission) => submission.status === 'graded').length;

            return {
                _id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                due_date: assignment.due_date,
                total_marks: assignment.total_marks,
                createdAt: assignment.createdAt,
                teacher: {
                    _id: assignment.teacher_id?._id,
                    name: assignment.teacher_id?.user_id?.full_name || 'Unknown Teacher',
                    email: assignment.teacher_id?.user_id?.email,
                },
                class_name: assignment.class_subject_id?.class_id?.name || 'N/A',
                subject_name: assignment.class_subject_id?.subject_id?.name || 'N/A',
                submission_count: formattedSubmissions.length,
                graded_count: gradedCount,
                pending_grading_count: formattedSubmissions.length - gradedCount,
                submissions: formattedSubmissions,
            };
        });

        res.json({
            data: feed,
            total: feed.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAssignmentSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { assignmentId } = req.params;

        if (req.user?.role === 'teacher') {
            const teacherProfile = await Teacher.findOne({ user_id: req.user.id }).select('_id');
            if (!teacherProfile) {
                res.status(404).json({ message: 'Teacher profile not found' });
                return;
            }

            const assignment = await Assignment.findById(assignmentId).select('teacher_id');
            if (!assignment) {
                res.status(404).json({ message: 'Assignment not found' });
                return;
            }

            if (String(assignment.teacher_id) !== String(teacherProfile._id)) {
                res.status(403).json({ message: 'You are not authorized to view these submissions' });
                return;
            }
        }

        const submissions = await AssignmentSubmission.find({ assignment_id: assignmentId })
            .populate({
                path: 'student_id',
                populate: { path: 'user_id', select: 'full_name email' },
            })
            .sort({ submitted_at: -1 });

        const formattedSubmissions = submissions.map((submission: any) => ({
            _id: submission._id,
            status: submission.status,
            submission_text: submission.submission_text,
            attachment_url: submission.attachment_url,
            submitted_at: submission.submitted_at,
            marks_obtained: submission.marks_obtained,
            feedback: submission.feedback,
            graded_at: submission.graded_at,
            student: {
                _id: submission.student_id?._id,
                name: submission.student_id?.user_id?.full_name || 'Unknown Student',
                email: submission.student_id?.user_id?.email,
            },
        }));

        res.json({
            data: formattedSubmissions,
            total: formattedSubmissions.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
