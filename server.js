require('dotenv').config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import logger from 'morgan';

const PORT = process.env.PORT || 4000;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const app = express();
app.use(logger('dev'));
apollo.applyMiddleware({ app });
app.use('/static', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`🚀 Server ready at port ${PORT}`);
});
//
