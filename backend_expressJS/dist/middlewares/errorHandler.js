"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, _next) => {
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};
exports.default = errorHandler;
