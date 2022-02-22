import { gql } from 'apollo-server-express';

export default gql`
  type Subscription {
    roomUpdates(roomId: Int!): Message
  }
`;
