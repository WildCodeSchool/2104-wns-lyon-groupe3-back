import { gql } from "apollo-server-core";

export const TYPE_DEFS = gql`
    type addressInput {
        street: String!,
        postalCode: String!,
        city: String!
    }

    type User {
        id: ID
        firstname: String
        lastname: String
        birthday: String
        email: String
        password: String
        address: addressInput
        role: String
        isActive: String
        picture: String
        classes: [Class]
        class: Class
        legalRepresentative: [LegalRepresentative]
    }

    type Address {
        id: ID
        street: String
        postalCode: String
        city: String
    }

    type LegalRepresentative {
        id: ID
        firstname: String
        lastname: String
        email: String
        address: [Address]
        phone: String
    }

    type Class {
        id: ID
        name: String
        link: String
        timetable: [CourseDate]
        principalTeacher: User
        classRepresentative: [User]
    }

    type CourseDate {
        id: ID
        teacher: User
        matter: String
        day: String
        startHour: String
        endHour: String
    }

    type Assiduity {
        id: ID
        student: User
        date: String
        type: String
    }

    type PinMessages {
        id: ID
        course: CourseDate
        messages: [String]
    }

    type PrivateMessage {
        id: ID
        author: User
        recipient: [User]
        object: String
        message: String
    }


    type Query {
        allUsers: [User]
    }

    type Mutation {
        createUser(
            firstname: String!,
            lastname: String!,
            birthday: String,
            email: String!,
            password: String!,
            address: Array!,
            role: String!,
            isActive: String!,
            picture: String
        ): User
    }
`;