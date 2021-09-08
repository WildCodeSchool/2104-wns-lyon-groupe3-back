/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { init } from '../server';
import { config } from '../database/environment.testing';
import { gql } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ClassResolver } from "./ClassResolver";
const { createTestClient } = require('apollo-server-testing');

const Class = new ClassResolver();

const data = {
    name : "Classe Test",
    link: "https://meet.google.com/rdq-epim-wnb"
};

const GET_ALL_CLASSES = gql`{getAllClasses{_id, name, link}}`;

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
      _id  
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
                const allClasses = await Class.getAllClasses();
                const count = allClasses.length;

                const { query } = createTestClient(apollo);
                const res = await query({ query: GET_ALL_CLASSES });

                expect(res.data.getAllClasses).toBeDefined();
                expect(res.data.getAllClasses.length).toEqual(count)
            }
        )

        it(
            "Should get the class associate to the Id",
            async ()=>{
                const {query, mutate} = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_CLASS, variables: data});
                const res2 = await query({ query: GET_CLASS_BY_ID, variables: {id: res1.data.createClass._id}});

                expect(res1.data.createClass._id).toEqual(res2.data.getClassById._id);
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