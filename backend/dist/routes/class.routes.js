"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const class_controller_1 = require("../controllers/class.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(auth_middleware_1.protect, class_controller_1.getClasses)
    .post(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), class_controller_1.createClass);
router.route('/:id')
    .get(auth_middleware_1.protect, class_controller_1.getClassById)
    .put(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), class_controller_1.updateClass)
    .delete(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), class_controller_1.deleteClass);
exports.default = router;
