import { Request, Response } from 'express';
import Fee from '../models/Fee';
import Student from '../models/Student';
import Class from '../models/Class';

export const getFees = async (req: Request, res: Response): Promise<void> => {
    try {
        const fees = await Fee.find()
            .populate('student_id', 'user_id admission_number')
            .populate('class_id', 'name level')
            .sort({ created_at: -1 });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * GET /fees/student/:studentId
 * Returns all fee bills that apply to a student:
 *   - Class-level bills (class_id matches student's class)
 *   - Student-specific bills (student_id matches)
 * Grouped and enriched so the parent can see per-session/term breakdown.
 */
export const getStudentFees = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.studentId)
            .select('class_id paid_fees outstanding_carried payment_history admission_number')
            .populate('class_id');
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }

        const classDoc = student.class_id as any;
        const feeStructure = classDoc?.fee_structure ?? null;

        // Total current term bill from class fee_structure
        const currentTermTotal = Number(feeStructure?.total) || 0;
        const paidFees = Number(student.paid_fees) || 0;
        const outstandingCarried = Number((student as any).outstanding_carried) || 0;

        // Outstanding = unpaid current term + any carried-over arrears
        const currentOutstanding = Math.max(0, currentTermTotal - paidFees);
        const totalOutstanding = currentOutstanding + outstandingCarried;

        res.json({
            class_fee_structure: feeStructure,
            class_name: classDoc?.name ?? '',
            class_level: classDoc?.level ?? '',
            class_academic_year: classDoc?.academic_year ?? '',
            current_term_total: currentTermTotal,
            paid_fees: paidFees,
            outstanding_carried: outstandingCarried,
            current_outstanding: currentOutstanding,
            total_outstanding: totalOutstanding,
            payment_history: student.payment_history || [],
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getFeeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const fee = await Fee.findById(req.params.id)
            .populate('student_id')
            .populate('class_id', 'name level');
        if (!fee) { res.status(404).json({ message: 'Fee not found' }); return; }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createFee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { class_id, student_id, title, description, amount, due_date, status, session, term } = req.body;

        if (!class_id && !student_id) {
            res.status(400).json({ message: 'Either class_id or student_id is required' });
            return;
        }

        const fee = await Fee.create({
            class_id: class_id || undefined,
            student_id: student_id || undefined,
            title,
            description,
            amount,
            due_date,
            status: status || 'pending',
            session: session || '',
            term: term || '',
        });

        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateFee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, amount, due_date, status, paid_date, session, term } = req.body;
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { title, description, amount, due_date, status, paid_date, session, term },
            { new: true }
        );
        if (!fee) { res.status(404).json({ message: 'Fee not found' }); return; }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteFee = async (req: Request, res: Response): Promise<void> => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) { res.status(404).json({ message: 'Fee not found' }); return; }
        res.json({ message: 'Fee deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
