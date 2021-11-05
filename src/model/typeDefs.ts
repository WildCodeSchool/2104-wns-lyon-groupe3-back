import { gql } from "apollo-server-express";

const typeDefs = gql`
    type User {
        id: ID
        firstname: String
        lastname: String
        birthday: String
        email: String
        password: String
        role: String
        isActive: String
        picture: String
    }
    type Query {
        currentUser: User
    }
    type Query {
        allUsers: [User]
    }
    type Query {
        userById: User
    }
    type AuthPayload {
        user: User
    }
    type Mutation {
        logout: Boolean
    }
    type Mutation {
        login(email: String!, password: String!): AuthPayload
    }
`;

// const typeDefs = gql`
//     type User {
//         id: ID
//         firstname: String
//         lastname: String
//         birthday: String
//         email: String
//         password: String
//         role: String
//         isActive: String
//         picture: String
//     }
//     type Query {
//         allUsers: [User]
//     }
//     type Query {
//         currentUser: User
//     }
//     type Mutation {
//         createUser(
//             firstname: String!,
//             lastname: String!,
//             birthday: String,
//             email: String!,
//             password: String!,
//             address: Array!,
//             role: String!,
//             isActive: String!,
//             picture: String
//         ): User
//     }
// `;

export default typeDefs;