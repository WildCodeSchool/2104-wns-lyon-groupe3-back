"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const db = (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.toString();
exports.config = {
    db: db,
    options: options,
    serverPort: 5000
};
