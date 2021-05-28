/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";


import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./controller/UserResolver";

export async function init(config: any): Promise<any> {
    const schema: GraphQLSchema = await buildSchema(
        {
            resolvers: [UserResolver]
        }
    );

    const server: ApolloServer = new ApolloServer({ schema });

    if (config.autoListen) {
        await server.listen(4000);
    }

    await mongoose.connect(config.db, config.options);

   //console.log("Mongodb Started & Apollo server started at: http://localhost:4000/");
    return server;


}
