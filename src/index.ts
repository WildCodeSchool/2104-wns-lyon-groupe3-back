import { ApolloServer, ServerInfo } from "apollo-server";
import mongoose from "mongoose";
import { config, IConfig } from "./database/environment.dev";
// import logger from 'morgan';
import { TYPE_DEFS } from "./model/typeDefs";

const env:IConfig = config;

const resolvers = {};

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