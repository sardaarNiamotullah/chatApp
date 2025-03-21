"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const userService = __importStar(require("../services/userService"));
const createUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        const user = await userService.createUser(username, email, password, firstName, lastName);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: "Error creating user" });
    }
};
exports.createUser = createUser;
const getUsers = async (_req, res) => {
    const users = await userService.getUsers();
    res.json(users);
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { username, email, firstName, lastName } = req.body;
        const user = await userService.updateUser(req.params.id, {
            username,
            email,
            firstName,
            lastName,
        });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: "Error updating user" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "User deleted" });
    }
    catch (error) {
        res.status(400).json({ error: "Error deleting user" });
    }
};
exports.deleteUser = deleteUser;
