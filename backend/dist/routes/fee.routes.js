"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fee_controller_1 = require("../controllers/fee.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.protect, fee_controller_1.getFees);
router.get('/:id', auth_middleware_1.protect, fee_controller_1.getFeeById);
// Admin can manage fees
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), fee_controller_1.createFee);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), fee_controller_1.updateFee);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'), fee_controller_1.deleteFee);
exports.default = router;
