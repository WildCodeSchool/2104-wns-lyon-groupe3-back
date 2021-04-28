"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const mongoose_1 = __importDefault(require("mongoose"));
const environment_dev_1 = require("./database/environment.dev");
// import logger from 'morgan';
const typeDefs_1 = require("./model/typeDefs");
const env = environment_dev_1.config;
const resolvers = {};
const server = new apollo_server_1.ApolloServer({
    typeDefs: typeDefs_1.TYPE_DEFS,
    resolvers: resolvers
});
server.listen().then((info) => console.log("Apollo Server started at: " + info.url));
mongoose_1.default.connect(env.db, env.options).then(() => console.log('mongo started'));
