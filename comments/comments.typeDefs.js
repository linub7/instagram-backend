import { gql } from 'apollo-server-express';

export default gql`
  type Comment {
    id: Int!
    user: User!
    photo: Photo!
    payload: String!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    addComment(photoId: Int!, payload: String!): MutationResponse!
  }
`;
