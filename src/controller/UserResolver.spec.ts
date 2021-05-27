/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { init } from '../index';
import { config } from '../database/environment.dev';
import { gql } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
// import { UserResolver } from './UserResolver';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
const { createTestClient } = require('apollo-server-testing');

// const User = new UserResolver();

const GET_USER_BY_ID = gql`
    query getUserById($id: String!) {
        getUserById(id: $id) {_id, firstname}
    }
`;

describe(
    "Tests on getUserById",
    () => {
        let apollo:ApolloServer|null = null;
        const mongo:MongoMemoryServer = new MongoMemoryServer();

        beforeAll(
            async () => {
                apollo = await init(config);
            }
        )

        afterAll(
            async () => {
                if (apollo !== null)
                    await apollo.stop();

                await mongo.stop();
                await mongoose.disconnect();
            }
        );

        it(
            'We should get the user associated to the id',
            async () => {
                const { query } = createTestClient(apollo);
                const res = await query({ query: GET_USER_BY_ID, variables: {id: "608a7c08a63cc35a88514552"} });
                expect(res.data.getUserById.firstname).toEqual("Catherine");
            }
        )
    }
);