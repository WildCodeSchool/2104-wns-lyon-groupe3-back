/* eslint-disable @typescript-eslint/no-explicit-any */
// import { config } from "./database/environment.dev";
// import mongoose from "mongoose";
// import resolvers from './resolvers';
// import { GraphQLSchema } from "graphql";
// import { ClassResolver } from "./controller/ClassResolver";
// import { PrivateMessageResolver } from "./controller/PrivateMessageResolver";

import "reflect-metadata";
import { Error, FilterQuery } from "mongoose";
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { v4 as uuid } from 'uuid';
import passport from 'passport';
import { buildContext, GraphQLLocalStrategy } from "graphql-passport";
import http from "http";
import User from "./controller/User";
import { IUser } from "./model/userModel";
import typeDefs from './model/typeDefs';
import { userResolvers as resolvers } from "./controller/UserResolver";

// to move on .env variables next
const SESSION_SECRECT = "bad secret";
const PORT = 4000;

passport.serializeUser((id, done) => {
    done(null, id);
});

passport.deserializeUser((id, done) => {
    const matchingUser = User.getUserById(id as FilterQuery<IUser> | undefined);
    done(null, matchingUser);
});

passport.use(
    new GraphQLLocalStrategy((email, password, done) => {
        const userByEmail = User.getUserByEmail(email as FilterQuery<IUser> | undefined);
        let error;
        if (userByEmail === null) {
            error = new Error("No matching has been found");
        } else {
            console.log({userByEmail})
        }
        done(error, userByEmail)
    })
)

// passport.use(
//     new GraphQLLocalStrategy((email, password, done) => {
//       const users = User.getUsers();
//       const matchingUser = users.find(user => email === user.email && password === user.password);
//       const error = matchingUser ? null : new Error('no matching user');
//       done(error, matchingUser);
//     }),
//   );

const app:any = express();
const httpServer = http.createServer(app);

app.use(session({
    genid: (req) => uuid(),
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res })
    // context: ({ req }) => ({
    //     getUser: () => req.user,
    //     logout: () => req.logout(),
    //     userById: (id) => req.userById(id)
    // }),
});

server.start().then(() => server.applyMiddleware({ app }))

httpServer.listen({ port: PORT }, () => console.log(`Mongodb & Apollo server started at: http://localhost:${PORT}/graphql`));