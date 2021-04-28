"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPE_DEFS = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.TYPE_DEFS = apollo_server_core_1.gql `
    type User {
        id: ID
        firstname: String
        lastname: String
        birthday: String
        email: String
        password: String
        address: String
        role: String
        isActive: String
        picture: String
        classes: [Class]
        class: Class
        legalRepresentative: [LegalRepresentative]
    }

    type LegalRepresentative {
        id: ID
        firstname: String
        lastname: String
        email: String
        address: String
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
`;
