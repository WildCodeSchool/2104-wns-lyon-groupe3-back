/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { init } from '../server';
import { config } from '../database/environment.testing';
import { gql } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
const { createTestClient } = require('apollo-server-testing');


//#region Datas
const data1 = {
    name: "6e2",
    link: "https://meet.google.com/2",
    timetable: [ 
        {
            teacherId: "6106b57cdc8b174fc8b2185a",
            matter: "SVT",
            day: "Monday",
            startHour: "9:00",
            endHour: "11:00"
        },        
        {
            teacherId: "6106b57cdc8b174fc8b2185a",
            matter: "SVT",
            day: "Wednesday",
            startHour: "11:00",
            endHour: "12:30"
        },
    ],
    principalTeacherId: "6106b57cdc8b174fc8b2185a",
    classRepresentativesIds: [
      "6103f42f70e92056a8b4077c", 
      "6103f49870e92056a8b40782"
    ]
};

const data2 = {
    name: "5e3",
    link: "https://meet.google.com/253435",
    timetable: [ 
        {
            teacherId: "6106b57cdc8b174fc8b2185a",
            matter: "Art",
            day: "Thursday",
            startHour: "10:00",
            endHour: "11:30"
        },        
        {
            teacherId: "6106b57cdc8b174fc8b2185a",
            matter: "Art",
            day: "Wednesday",
            startHour: "10:00",
            endHour: "12:30"
        },
    ],
    principalTeacherId: "6106b57cdc8b174fc8b2185a",
    classRepresentativesIds: [
      "6103f42f70e92056a8b4077c", 
      "6103f49870e92056a8b40782"
    ]
};
//#endregion


//#region Queries and Mutations
const GET_ALL_CLASSES = gql`{getAllClasses{_id, name, link}}`;

const GET_CLASS_BY_ID = gql`
    query getClassById($id: String!) {
        getClassById(id: $id) {
            _id, 
            name, 
            link,
            timetable{
                teacherId, 
                matter, 
                day, 
                startHour, 
                endHour
            }, 
            principalTeacherId, 
            classRepresentativesIds
        }
    }
`;

const CREATE_CLASS = gql`
mutation createClass(
    $name: String!
    $link: String!
    $timetable:[courseDateInput!]
    $principalTeacherId: String!
    $classRepresentativesIds: [String!]
  
  ) {
    createClass(
      name: $name
      link: $link
      timetable: $timetable
      principalTeacherId: $principalTeacherId
      classRepresentativesIds: $classRepresentativesIds
    ) {
        _id
        name
        link
        timetable{
            teacherId
            matter
            day
            startHour
            endHour
        }
        principalTeacherId
        classRepresentativesIds
    }
  }
`;
//#endregion

//#region TESTS
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
            "Should get the right ids and the right number of entries",
            async ()=>{
                
                const { query, mutate } = createTestClient(apollo);
                const res1 = await mutate({ query: CREATE_CLASS, variables: data1})
                const res2 = await mutate({ query: CREATE_CLASS, variables: data2})
                const allRes = [res1, res2];
                const allClasses = await query({ query: GET_ALL_CLASSES });

                expect(allClasses.data.getAllClasses.length).toEqual(allRes.length);
                expect(allClasses.data.getAllClasses[0]._id).toEqual(res1.data.createClass._id);
                expect(allClasses.data.getAllClasses[1]._id).toEqual(res2.data.createClass._id);
            }
        )

        it(
            "Should get the class associate to the Id",
            async ()=>{
                const {query, mutate} = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_CLASS, variables: data1});
                const res2 = await query({ query: GET_CLASS_BY_ID, variables: {id: res1.data.createClass._id}});

                expect(res1.data.createClass._id).toEqual(res2.data.getClassById._id);
            }
        )

        it(
            'Should create a new class and insert it in database',
            async () => {
                const { mutate } = createTestClient(apollo);
                const res = await mutate({ query: CREATE_CLASS, variables: data1 });

                expect(res.data.createClass.name).toEqual(data1.name);
                expect(res.data.createClass.link).toEqual(data1.link);
            }
        )
    }
);
//#endregion