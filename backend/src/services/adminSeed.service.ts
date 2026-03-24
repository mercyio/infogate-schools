import bcrypt from 'bcrypt';
import User from '../models/User';

export const seedAdminUser = async (): Promise<void> => {
    try {
        const adminRegNumber = process.env.ADMIN_REG_NUMBER;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminRegNumber || !adminPassword) {
            console.warn('⚠️ Admin Seed warning: ADMIN_REG_NUMBER or ADMIN_PASSWORD is not defined in .env');
            return;
        }

        // Check if admin already exists by reg_number or email
        const existingAdmin = await User.findOne({
            $or: [
                { reg_number: adminRegNumber },
                { email: 'admin@infogateschools.com' }
            ]
        });

        if (existingAdmin) {
            console.log(`✅ Admin user (${adminRegNumber} or admin@infogateschools.com) already exists in the database. Skipping seeding.`);
            return;
        }

        console.log(`🌱 Seeding initial admin user (${adminRegNumber})...`);

        // Hash the admin password and create the user
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);

        await User.create({
            reg_number: adminRegNumber,
            passwordHash,
            role: 'admin',
            full_name: 'Master Admin',
            email: 'admin@infogateschools.com', // Optional fallback email
        });

        console.log(`✅ Admin user (${adminRegNumber}) seeded successfully.`);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};
