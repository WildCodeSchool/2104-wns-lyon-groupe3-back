/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { init } from '../index';
import { config } from '../database/environment.dev';
import { gql } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
const { createTestClient } = require('apollo-server-testing');
// import UserModel from "../model/userModel";
import { UserResolver } from "./UserResolver";

const User = new UserResolver();

const data = {
    firstname: "Pierre",
    lastname: "Caillou",
    email: "pierrefeuilleciseaux@gneugneu.com",
    address: "1 rue de la roche",
    role: "STUDENT",
    isActive: "ACTIVE",
    birthday: "",
    picture: ""
};

const GET_ALL_USERS = gql`{getAllUsers{firstname, lastname, email}}`;

const GET_USER_BY_ID = gql`
    query getUserById($id: String!) {
        getUserById(id: $id) {_id, firstname}
    }
`;

const CREATE_USER = gql`
    mutation createUser(
        $firstname: String!,
        $lastname: String!,
        $email: String!,
        $address: String!,
        $role: String,
        $isActive: String,
        $birthday: String,
        $picture: String,
    ) {
        createUser(
            firstname: $firstname,
            lastname: $lastname,
            email: $email,
            address: $address,
            role: $role,
            isActive: $isActive,
            birthday: $birthday,
            picture: $picture
        ) {
            _id, firstname, lastname, email, address, role, isActive, birthday, picture
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser(
        $id: String!,
        $firstname: String!,
        $lastname: String!,
        $email: String!,
        $address: String!,
        $role: String,
        $isActive: String,
        $birthday: String,
        $picture: String,
    ) {
        updateUser(
            id: $id,
            firstname: $firstname,
            lastname: $lastname,
            email: $email,
            address: $address,
            role: $role,
            isActive: $isActive,
            birthday: $birthday,
            picture: $picture
        ) {
            _id, firstname, lastname, email, address, role, isActive, birthday, picture
        }
    }
`;

const DELETE_USER = gql`
    mutation deleteUser($id: String!) {
        deleteUser(id: $id) {
            _id, firstname, lastname, email, address, role, isActive, birthday, picture
        }
    }
`;

describe(
    "Tests on getUserById",
    () => {
        let apollo: ApolloServer | null = null;
        const mongo: MongoMemoryServer = new MongoMemoryServer();

        beforeAll(
            async () => {
                // config.db = await mongo.getUri();
                // console.log(config);
                apollo = await init(config);
            }
        )

        // après chaque test
        afterEach(
            async () => {
                // on vide toutes les collections après chaque test, comme ça on 
                // ne dépend pas de l'ordre d'éxécution des tests
                const collections = mongoose.connection.collections;
                for (const key in collections) {
                    await mongoose.connection.db.collection(key).deleteMany({});
                }
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
            "We should get the same number of objects in the Resolver than in the query",
            async () => {
                // const spy = jest.spyOn(UserModel, "find");
                // expect(spy).toHaveBeenCalledTimes(1);

                const allUsers = await User.getAllUsers();
                const count = allUsers.length;

                const { query } = createTestClient(apollo);
                const res = await query({ query: GET_ALL_USERS });

                expect(res.data.getAllUsers).toBeDefined();
                expect(res.data.getAllUsers.length).toEqual(count);
            }
        )

        it(
            'We should get the user associated to the id',
            async () => {
                const { query, mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await query({ query: GET_USER_BY_ID, variables: { id: res1.data.createUser._id } });

                expect(res1.data.createUser._id).toEqual(res2.data.getUserById._id);
            }
        )

        it(
            'We should create a new user and insert it in database',
            async () => {
                const { mutate } = createTestClient(apollo);
                const res = await mutate({ query: CREATE_USER, variables: data });

                expect(res.data.createUser.email).toEqual(data.email);
                expect(res.data.createUser.firstname).toEqual(data.firstname);
            }
        )

        it(
            'We should update user informations',
            async () => {
                const { mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });

                const newData = {
                    id: res1.data.createUser._id,
                    firstname: "Seb",
                    lastname: "Promènelechien",
                    email: "sebaimesonchien@gneugneu.com",
                    address: "1 rue du ptit chiot trop mimi",
                    role: "STUDENT",
                    isActive: "ACTIVE",
                    birthday: "",
                    picture: ""
                }

                const res2 = await mutate({ query: UPDATE_USER, variables: newData });

                expect(res2.data.updateUser.firstname).toEqual(newData.firstname);
                expect(res2.data.updateUser.email).toEqual(newData.email);
            }
        )

        it(
            'We should delete a user',
            async () => {
                const { mutate } = createTestClient(apollo);
                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await mutate({ query: DELETE_USER, variables: {id: res1.data.createUser._id} });

                expect(res2.data.deleteUser._id).toEqual(res1.data.createUser._id);
                expect(res2.data.deleteUser.email).toEqual(res1.data.createUser.email);
            }
        )
    }
);