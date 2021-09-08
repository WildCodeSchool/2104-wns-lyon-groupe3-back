/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { init } from "../server";
import { config } from '../database/environment.testing';
import { gql } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
const { createTestClient } = require('apollo-server-testing');
// import { PrivateMessageResolver } from "./PrivateMessageResolver";
// import { UserResolver } from "./UserResolver";

// const PrivateMessage = new PrivateMessageResolver();
// const User = new UserResolver();

const senderData1 = {
    firstname: "Pierre",
    lastname: "Caillou",
    email: "pierrefeuilleciseaux@gneugneu.com",
    address: {
        street: "15 rue de la roche",
        postalCode: "14000",
        city: "Caen"
    },
    role: "STUDENT",
    isActive: "ACTIVE",
    birthday: "",
    picture: ""
};

const senderData2 = {
    firstname: "Jacques",
    lastname: "Ouille",
    email: "journuit@visiteurs.com",
    address: {
        street: "50 rue du château",
        postalCode: "14000",
        city: "Caen"
    },
    role: "STUDENT",
    isActive: "ACTIVE",
    birthday: "",
    picture: ""
};

const recipientData1 = {
    firstname: "Seb",
    lastname: "Astien",
    email: "sebaimesonchien@woufwouf.com",
    address: {
        street: "7 rue des Labradors",
        postalCode: "26100",
        city: "Valence"
    },
    role: "STUDENT",
    isActive: "ACTIVE",
    birthday: "",
    picture: ""
};

const recipientData2 = {
    firstname: "Quentin",
    lastname: "Deuxtrois",
    email: "quentin23@poitiers.com",
    address: {
        street: "27 avenue de la moula",
        postalCode: "86000",
        city: "Poitiers"
    },
    role: "STUDENT",
    isActive: "ACTIVE",
    birthday: "",
    picture: ""
};

const GET_ALL_PRIVATE_MESSAGES_FOR_USER_SENDER = gql`
    query getAllPrivateMessagesForUserSender($author: String!) {
        getAllPrivateMessagesForUserSender(author: $author) {
            author, message
        }
    }
`;

const GET_ALL_PRIVATE_MESSAGES_FOR_USER_RECIPIENT = gql`
    query getAllPrivateMessagesForUserRecipient($userId: String!) {
        getAllPrivateMessagesForUserRecipient(userId: $userId) {
            author, recipients { userId}, message
        }
    }
`;

const CREATE_PRIVATE_MESSAGE = gql`
    mutation createPrivateMessage(
        $author: String!,
        $recipients: [recipientInput!]!,
        $object: String,
        $message: String!
    ) {
        createPrivateMessage(
            author: $author,
            recipients: $recipients,
            object: $object,
            message: $message
        ) {
            author, recipients { userId }, object, message
        }
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

describe(
    "Tests on private messages",
    () => {
        let apollo: ApolloServer | null = null;
        let mongo: MongoMemoryServer = new MongoMemoryServer();

        // avant les tests
        beforeAll(
            async () => {
                mongo = new MongoMemoryServer();
                config.db = await mongo.getUri();

                apollo = await init(config);
            }
        )

        afterEach(
            async () => {
                const collections = mongoose.connection.collections;

                for (const key in collections) {
                    await mongoose.connection.db.collection(key).deleteMany({});
                }
            }
        )

        afterAll(
            async () => {
                if (apollo !== null) {
                    await apollo.stop();
                }

                await mongo.stop();
                await mongoose.disconnect();
            }
        );

        it(
            "We should create a new private message with one author and two recipients",
            async () => {
                const { mutate } = createTestClient(apollo);

                // We create users to send and receive the message
                const userSender = await mutate({ query: CREATE_USER, variables: senderData1 });
                const recipient1 = await mutate({ query: CREATE_USER, variables: recipientData1 });
                const recipient2 = await mutate({ query: CREATE_USER, variables: recipientData2 });
                const allRecipients = [ recipient1, recipient2 ];

                const privateMessageData = {
                    author: userSender.data.createUser._id,
                    recipients: [
                        { userId: recipient1.data.createUser._id },
                        { userId: recipient2.data.createUser._id },
                    ],
                    object: null,
                    message: "Salut comment ça va ?"
                };

                const res = await mutate({ query: CREATE_PRIVATE_MESSAGE, variables: privateMessageData });

                expect(res.data.createPrivateMessage.author).toEqual(userSender.data.createUser._id);
                expect(res.data.createPrivateMessage.message).toEqual(privateMessageData.message);

                allRecipients.map((recipient) => {
                    expect(res.data.createPrivateMessage.recipients).toContainEqual({ userId: recipient.data.createUser._id });
                });
            }
        )

        it(
            "We should get all messages authored by user",
            async ()=>{
                const { mutate } = createTestClient(apollo);

                //We create users to send and receive messages, and the messages to be sent
                const userSender = await mutate({ query: CREATE_USER, variables: senderData1 });
                const recipient1 = await mutate({ query: CREATE_USER, variables: recipientData1 });
                const recipient2 = await mutate({ query: CREATE_USER, variables: recipientData2 });

                const privateMessageData1 = {
                    author: userSender.data.createUser._id,
                    recipients: [
                        { userId: recipient1.data.createUser._id }
                    ],
                    object: null,
                    message: "Salut comment ça va ?"
                };

                const privateMessageData2 = {
                    author: userSender.data.createUser._id,
                    recipients: [
                        { userId: recipient1.data.createUser._id }
                    ],
                    object: null,
                    message: "Faut qu'on parle."
                };

                const privateMessageData3 = {
                    author: userSender.data.createUser._id,
                    recipients: [
                        { userId: recipient2.data.createUser._id }
                    ],
                    object: null,
                    message: "Bonjour."
                };

                const privateMessageData4 = {
                    author: userSender.data.createUser._id,
                    recipients: [
                        { userId: recipient2.data.createUser._id }
                    ],
                    object: null,
                    message: "Comment vous portez-vous?"
                };

                const res1 = await mutate({ query: CREATE_PRIVATE_MESSAGE, variables: privateMessageData1 });
                const res2 = await mutate({ query: CREATE_PRIVATE_MESSAGE, variables: privateMessageData2 });
                const res3 = await mutate({ query: CREATE_PRIVATE_MESSAGE, variables: privateMessageData3 });
                const res4 = await mutate({ query: CREATE_PRIVATE_MESSAGE, variables: privateMessageData4 });
                const allRes = [res1, res2, res3, res4];
                
                const allAuthoredMessages = await mutate({ query: GET_ALL_PRIVATE_MESSAGES_FOR_USER_SENDER, variables: { author: userSender.data.createUser._id } });

                allRes.map((res, id) => {
                    expect(res.data.createPrivateMessage.author).toEqual(allAuthoredMessages.data.getAllPrivateMessagesForUserSender[id].author);
                    expect(res.data.createPrivateMessage.message).toEqual(allAuthoredMessages.data.getAllPrivateMessagesForUserSender[id].message);
                });
            }
        )

        it(
            "We should get all messages received by user",
            async ()=>{
                const { mutate } = createTestClient(apollo);

                //We create users to send and receive messages, and the messages to be sent
                const recipient1 = await mutate({ query: CREATE_USER, variables: recipientData1 });
                const recipient2 = await mutate({ query: CREATE_USER, variables: recipientData2 });
                const userSender1 = await mutate({ query: CREATE_USER, variables: senderData1 });
                const userSender2 = await mutate({ query: CREATE_USER, variables: senderData2 });
                const allRecipients = [recipient1, recipient2];

                const privateMessageData1 = {
                    author: userSender1.data.createUser._id,
                    recipients: [
                        { userId: recipient1.data.createUser._id },
                        { userId: recipient2.data.createUser._id },
                    ],
                    object: null,
                    message: "Salut comment ça va ?"
                };

                const privateMessageData2 = {
                    author: userSender1.data.createUser._id,
                    recipients: [
                        { userId: recipient2.data.createUser._id },
                        { userId: recipient1.data.createUser._id }
                    ],
                    object: null,
                    message: "Faut qu'on parle."
                };

                const privateMessageData3 = {
                    author: userSender2.data.createUser._id,
                    recipients: [
                        { userId: recipient2.data.createUser._id }
                    ],
                    object: null,
                    message: "Bonjour."
                };

                const privateMessageData4 = {
                    author: userSender2.data.createUser._id,
                    recipients: [
                        { userId: recipient1.data.createUser._id }
                    ],
                    object: null,
                    message: "Comment vous portez-vous?"
                };

                const privateMessageDatas = [privateMessageData1, privateMessageData2, privateMessageData3, privateMessageData4];

                await privateMessageDatas.map((data) => {
                    return mutate({ query: CREATE_PRIVATE_MESSAGE, variables: data });
                });
                
                const allRecipient1Messages = await mutate(
                    { 
                        query: GET_ALL_PRIVATE_MESSAGES_FOR_USER_RECIPIENT, 
                        variables: { userId: recipient1.data.createUser._id } 
                    })
                ;

                const allRecipient2Messages = await mutate(
                    { 
                        query: GET_ALL_PRIVATE_MESSAGES_FOR_USER_RECIPIENT, 
                        variables: { userId: recipient2.data.createUser._id } 
                    }
                );
                
                // Search the recipients' id for all the received messages
                const received1 = allRecipient1Messages.data.getAllPrivateMessagesForUserRecipient;
                received1.map((message) => {
                    expect(message.recipients).toContainEqual({ userId: recipient1.data.createUser._id });
                })

                const received2 = allRecipient2Messages.data.getAllPrivateMessagesForUserRecipient;
                received2.map((message) => {
                    expect(message.recipients).toContainEqual({ userId: recipient2.data.createUser._id });
                })
                
                //Compare the authors who sent and the userSender's id.
                // expect(res1.data.createPrivateMessage.recipients).toContain(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[0]._id);
                // expect(res2.data.createPrivateMessage.recipients).toContain(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[1].author);
                // expect(res3.data.createPrivateMessage.recipients).toContain(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[2].author);
                // expect(res4.data.createPrivateMessage.recipients).toContain(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[3].author);

                //Compare the messages sent to the messages from userSender
                // expect(res1.data.createPrivateMessage.message).toEqual(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[0].message);
                // expect(res2.data.createPrivateMessage.message).toEqual(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[1].message);
                // expect(res3.data.createPrivateMessage.message).toEqual(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[2].message);
                // expect(res4.data.createPrivateMessage.message).toEqual(allReceivedMessages.data.getAllPrivateMessagesForUserRecipient[3].message);
            }
        )
    }
)