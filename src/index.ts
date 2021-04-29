import { ApolloServer, ServerInfo } from "apollo-server";
import mongoose from "mongoose";
import { config, IConfig } from "./database/environment.dev";
import UserController from './controller/UserController';
// import logger from 'morgan';
import { TYPE_DEFS } from "./model/typeDefs";

const userController:UserController = new UserController();
const env:IConfig = config;

const resolvers = {
    Query: {
        allUsers: userController.read
    },
    Mutation: {
        createUser: userController.create
    }
};

const server = new ApolloServer(
    {
        typeDefs: TYPE_DEFS,
        resolvers: resolvers
    }
);

server.listen().then((info:ServerInfo) => console.log("Apollo Server started at: " + info.url));

mongoose.connect(
    env.db,
    env.options
).then(() => console.log('mongo started')).catch((err) => console.log("ERROR", err));