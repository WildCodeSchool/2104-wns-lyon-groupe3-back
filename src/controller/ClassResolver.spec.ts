import "reflect-metadata";
import { init } from '../server';
import { config } from '../database/environment.testing';
import { gql } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createTestClient } from 'apollo-server-testing';
// import UserModel from "../model/userModel";
import { ClassResolver } from "./ClassResolver";

const Class = new ClassResolver();

const data = {
    name : "Classe Test",
    link: "https://meet.google.com/rdq-epim-wnb"
};

const GET_ALL_CLASSES = gql`{getAllClass{_id, name, link}}`;

const GET_CLASS_BY_ID = gql`
    query getClassById($id: String!) {
        getClassById(id: $id) {_id, name, link}
    }
`;

const CREATE_CLASS = gql`
mutation createClass(
    $name: String!
    $link: String!
  ) {
    createClass(
      name: $name
      link: $link
    ) {
      name
      link
    }
  }
`;

describe(
    "Tests on getClassById",
    ()=>{
        let apollo: ApolloServer | null = null;
        let mongo: MongoMemoryServer = new MongoMemoryServer();

        beforeAll(
            async()=>{
                mongo= new MongoMemoryServer();
                config.db = await mongo.getUri();

                apollo = await init(config);
            }
        );

        afterEach(
            async ()=>{
                const collections = mongoose.connection.collections;
                for (const key in collections){
                    await mongoose.connection.db.collection(key).deleteMany({});
                }
            }
        );

        afterAll(
            async ()=>{
                if (apollo !== null) await apollo.stop();

                await mongo.stop();

                await mongoose.disconnect();
            }
        );

        it(
            "Should get the same number of objects in the Resolver than in the query",
            async ()=>{
                const allClasses = await Class.getAllClass();
                const count = allClasses.length;

                const { query } = createTestClient(apollo);
                const res = await query({ query: GET_ALL_CLASSES });

                expect(res.data.getAllClass).toBeDefined();
                expect(res.data.getAllClass.length).toEqual(count)
            }
        )

        it(
            'Should create a new class and insert it in database',
            async () => {
                const { mutate } = createTestClient(apollo);
                const res = await mutate({ query: CREATE_CLASS, variables: data });

                expect(res.data.createClass.name).toEqual(data.name);
                expect(res.data.createClass.link).toEqual(data.link);
            }
        )
    }
)