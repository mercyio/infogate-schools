"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/admin/dashboard', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), report_controller_1.getAdminDashboardStats);
router.get('/teacher/dashboard', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('teacher'), report_controller_1.getTeacherDashboardStats);
router.get('/student/dashboard', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('student'), report_controller_1.getStudentDashboardStats);
exports.default = router;
