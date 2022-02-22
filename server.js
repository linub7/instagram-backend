require('dotenv').config();
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import logger from 'morgan';

const PORT = process.env.PORT || 4000;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser, //  come from onConnect => line 31
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }) => {
      // token comes from http variables => const {token} = param

      if (!token) {
        throw new Error(`You can't listen`);
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser, // we return loggedInUser from onConnect and it will go to context
      };
    },
  },
});

const app = express();
app.use(logger('dev'));
apollo.applyMiddleware({ app });
app.use('/static', express.static('uploads'));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at port ${PORT}`);
});
//
