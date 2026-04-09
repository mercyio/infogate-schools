import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import AssignmentSubmission from '../models/AssignmentSubmission';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignments = await Assignment.find().populate('class_subject_id').populate('teacher_id');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, class_subject_id, due_date, total_marks } = req.body;
        const teacher_id = req.user.id;

        const assignment = await Assignment.create({
            title, description, class_subject_id, teacher_id, due_date, total_marks
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

export const getAssignmentSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assignmentId } = req.params;

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
