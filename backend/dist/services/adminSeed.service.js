"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdminUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const seedAdminUser = async () => {
    try {
        const adminRegNumber = process.env.ADMIN_REG_NUMBER;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminRegNumber || !adminPassword) {
            console.warn('⚠️ Admin Seed warning: ADMIN_REG_NUMBER or ADMIN_PASSWORD is not defined in .env');
            return;
        }
        // Check if admin already exists
        const existingAdmin = await User_1.default.findOne({ reg_number: adminRegNumber });
        if (existingAdmin) {
            console.log(`✅ Admin user (${adminRegNumber}) already exists in the database. Skipping seeding.`);
            return;
        }
        console.log(`🌱 Seeding initial admin user (${adminRegNumber})...`);
        // Hash the admin password and create the user
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(adminPassword, salt);
        await User_1.default.create({
            reg_number: adminRegNumber,
            passwordHash,
            role: 'admin',
            full_name: 'Master Admin',
            email: 'admin@infogateschools.com', // Optional fallback email
        });
        console.log(`✅ Admin user (${adminRegNumber}) seeded successfully.`);
    }
    catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};
exports.seedAdminUser = seedAdminUser;
