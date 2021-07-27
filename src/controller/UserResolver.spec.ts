/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { init } from '../server';
import { config } from '../database/environment.testing';
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
    address: {
        street: "15 rue de la paix",
        postalCode: "14000",
        city: "Caen"
    },
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

const GET_USER_BY_EMAIL = gql`
    query getUserByEmail($email: String!) {
        getUserByEmail(email: $email) {_id, email}
    }
`;

const GET_USERS_BY_ROLE = gql`
    query getUsersByRole($role: String!) {
        getUsersByRole(role: $role) {_id, role}
    }
`;

const GET_USERS_BY_ISACTIVE = gql`
    query getUsersByIsActive($isActive: String!) {
        getUsersByIsActive(isActive: $isActive) {_id, isActive}
    }
`;

const GET_USERS_BY_FIRSTNAME = gql`
    query getUsersByFirstname($firstname: String!) {
        getUsersByFirstname(firstname: $firstname) {_id, firstname}
    }
`;

const GET_USERS_BY_LASTNAME = gql`
    query getUsersByLastname($lastname: String!) {
        getUsersByLastname(lastname: $lastname) {_id, lastname}
    }
`;

const CREATE_USER = gql`
    mutation createUser(
        $firstname: String!,
        $lastname: String!,
        $email: String!,
        $address: addressInput!,
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
            _id, firstname, lastname, email, address{street, postalCode, city}, role, isActive, birthday, picture
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser(
        $id: String!,
        $firstname: String!,
        $lastname: String!,
        $email: String!,
        $address: addressInput!,
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
            _id, firstname, lastname, email, address{street, postalCode, city}, role, isActive, birthday, picture
        }
    }
`;

const DELETE_USER = gql`
    mutation deleteUser($id: String!) {
        deleteUser(id: $id) {
            _id, firstname, lastname, email, address{street, postalCode, city}, role, isActive, birthday, picture
        }
    }
`;

describe(
    "Tests on getUserById",
    () => {
        let apollo: ApolloServer | null = null;
        let mongo: MongoMemoryServer = new MongoMemoryServer();

        // avant tous les tests
        beforeAll(
            async () => {
                // on crée une version in memory de mongo
                mongo = new MongoMemoryServer();
                config.db = await mongo.getUri();

                // et on connecte notre apollo server
                apollo = await init(config);
            }
        );

        // après chaque test
        afterEach(
            async () => {
                // on vide toutes les collections après chaque test, comme ça on 
                // ne dépend pas de l'ordre d'exécution des tests
                const collections = mongoose.connection.collections;
                // console.log(collections);
                for (const key in collections) {
                    await mongoose.connection.db.collection(key).deleteMany({});
                }
            }
        )

        // après tous les tests
        afterAll(
            async () => {
                // on stoppe apollo server
                if (apollo !== null)
                    await apollo.stop();

                // on stoppe notre serveur mongo "in memory"
                await mongo.stop();
                // on déconnecte mongoose
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
            'We should get the user associated to the email',
            async () => {
                const { query, mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await query({ query: GET_USER_BY_EMAIL, variables: { email: res1.data.createUser.email } });

                expect(res1.data.createUser.email).toEqual(res2.data.getUserByEmail.email);
            }
        )

        it(
            'We should get the users associated to the role',
            async () => {
                const { query, mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await query({ query: GET_USERS_BY_ROLE, variables: { role: res1.data.createUser.role } });
                const users = res2.data.getUsersByRole;
                users.map((user) => (
                    expect(res1.data.createUser.role).toEqual(user.role)
                ))
            }
        )

        it(
            'We should get the users associated to the isActive',
            async () => {
                const { query, mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await query({ query: GET_USERS_BY_ISACTIVE, variables: { isActive: res1.data.createUser.isActive } });
                const users = res2.data.getUsersByIsActive;
                users.map((user) => (
                    expect(res1.data.createUser.isActive).toEqual(user.isActive)
                ))
            }
        )

        it(
            'We should get the users associated to the firstname',
            async () => {
                const { query, mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await query({ query: GET_USERS_BY_FIRSTNAME, variables: { firstname: res1.data.createUser.firstname } });
                const users = res2.data.getUsersByFirstname;
                users.map((user) => (
                    expect(res1.data.createUser.firstname).toEqual(user.firstname)
                ))
            }
        )

        it(
            'We should get the users associated to the lastname',
            async () => {
                const { query, mutate } = createTestClient(apollo);

                const res1 = await mutate({ query: CREATE_USER, variables: data });
                const res2 = await query({ query: GET_USERS_BY_LASTNAME, variables: { lastname: res1.data.createUser.lastname } });
                const users = res2.data.getUsersByLastname;
                users.map((user) => (
                    expect(res1.data.createUser.lastname).toEqual(user.lastname)
                ))
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
                    address: {
                        "street": "15 rue de la paix",
                        "postalCode": "14000",
                        "city": "Caen"
                    },
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