"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Students
router.get('/students', auth_middleware_1.protect, user_controller_1.getStudents);
router.post('/students', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.createStudent);
router.get('/students/:id', auth_middleware_1.protect, user_controller_1.getStudentById);
router.put('/students/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.updateStudent);
router.delete('/students/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.deleteStudent);
// Teachers
router.get('/teachers', auth_middleware_1.protect, user_controller_1.getTeachers);
router.post('/teachers', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.createTeacher);
router.get('/teachers/:id', auth_middleware_1.protect, user_controller_1.getTeacherById);
router.put('/teachers/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.updateTeacher);
router.delete('/teachers/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.deleteTeacher);
// Parents
router.get('/parents', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), user_controller_1.getParents);
router.post('/parents', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.createParent);
router.get('/parents/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), user_controller_1.getParentById);
router.put('/parents/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.updateParent);
router.delete('/parents/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), user_controller_1.deleteParent);
exports.default = router;
