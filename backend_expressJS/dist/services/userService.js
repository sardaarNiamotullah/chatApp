"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const createUser = async (username, email, password, firstName, lastName) => {
    return database_1.default.user.create({
        data: { username, email, password, firstName, lastName },
    });
};
exports.createUser = createUser;
const getUsers = async () => {
    return database_1.default.user.findMany();
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    return database_1.default.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
const updateUser = async (id, data) => {
    return database_1.default.user.update({ where: { id }, data });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return database_1.default.user.delete({ where: { id } });
};
exports.deleteUser = deleteUser;
