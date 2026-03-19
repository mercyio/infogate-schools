"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcement_controller_1 = require("../controllers/announcement.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.protect, announcement_controller_1.getAnnouncements);
router.get('/:id', auth_middleware_1.protect, announcement_controller_1.getAnnouncementById);
// Admin and Teacher can manage announcements
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), announcement_controller_1.createAnnouncement);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), announcement_controller_1.updateAnnouncement);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), announcement_controller_1.deleteAnnouncement);
exports.default = router;
