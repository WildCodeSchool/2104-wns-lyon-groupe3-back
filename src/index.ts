import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { config } from "./database/environment.dev";

import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./controller/UserResolver";

async function init() {
    const schema:GraphQLSchema = await buildSchema(
        {
            resolvers:[UserResolver]
        }
    );

    const server:ApolloServer = new ApolloServer({schema});

    await server.listen(4000);



    await mongoose.connect(config.db, config.options);

    console.log("Apollo server started at: http://localhost:4000/");
    console.log("mongodb started");
}

init();
