"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const communication_controller_1 = require("../controllers/communication.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/announcements')
    .get(auth_middleware_1.protect, communication_controller_1.getAnnouncements)
    .post(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), communication_controller_1.createAnnouncement);
router.route('/events')
    .get(auth_middleware_1.protect, communication_controller_1.getEvents)
    .post(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin', 'teacher'), communication_controller_1.createEvent);
exports.default = router;
