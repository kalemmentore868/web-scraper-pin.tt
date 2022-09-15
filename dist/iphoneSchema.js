"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const iphoneSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
    },
    storge: {
        type: String,
    },
    condition: {
        type: String,
    },
    images: {
        type: [String],
        required: true,
    },
    link: {
        type: String,
    },
});
const Iphone = mongoose_1.default.model("iphones", iphoneSchema);
exports.default = Iphone;
