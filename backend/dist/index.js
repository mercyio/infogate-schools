"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const class_routes_1 = __importDefault(require("./routes/class.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const assignment_routes_1 = __importDefault(require("./routes/assignment.routes"));
const communication_routes_1 = __importDefault(require("./routes/communication.routes"));
const announcement_routes_1 = __importDefault(require("./routes/announcement.routes"));
const fee_routes_1 = __importDefault(require("./routes/fee.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/classes', class_routes_1.default);
app.use('/api/subjects', subject_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/attendance', attendance_routes_1.default);
app.use('/api/assignments', assignment_routes_1.default);
app.use('/api/communication', communication_routes_1.default);
app.use('/api/announcements', announcement_routes_1.default);
app.use('/api/fees', fee_routes_1.default);
app.use('/api/reports', report_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.send('Infogate Schools API is running');
});
const PORT = process.env.PORT || 5000;
const adminSeed_service_1 = require("./services/adminSeed.service");
// Connect to database and start server
(0, db_1.default)().then(async () => {
    // Seed initial admin user
    await (0, adminSeed_service_1.seedAdminUser)();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database', err);
});
