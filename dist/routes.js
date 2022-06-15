"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = void 0;
const createCourseService_1 = __importDefault(require("./createCourseService"));
function createCourse(req, res) {
    createCourseService_1.default.execute({
        name: "NodeJS",
        educator: "Dani",
        duration: 10,
    });
    createCourseService_1.default.execute({
        name: "ReactJS",
        educator: "Diego",
    });
    return res.send();
}
exports.createCourse = createCourse;
