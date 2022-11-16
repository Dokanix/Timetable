"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, 'User must have username'],
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
    },
    password: {
        type: String,
        required: [true, 'An user must have a password'],
        select: false,
    },
    selectedStops: {
        type: [Number],
        default: [],
    },
});
userSchema.plugin(mongoose_unique_validator_1.default);
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
