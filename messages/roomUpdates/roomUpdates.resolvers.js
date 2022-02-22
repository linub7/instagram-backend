import { withFilter } from 'apollo-server-express';
import client from '../../client';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        // context.loggedInUser come from server.js:23
        const room = await client.room.findFirst({
          where: {
            id: args.roomId,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        if (!room) {
          throw new Error(`You shall not see this!`);
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { roomId }, { loggedInUser }) => {
            // (payload, variables) => {...}
            // payload: The message just created => sendMessage.resolvers.js:48
            // loggedInUser comes from context => server.js:23
            if (roomUpdates.roomId === roomId) {
              const room = await client.room.findFirst({
                where: {
                  id: roomId,
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });
              if (!room) {
                return false;
              }
              return true;
            }

            // on every trigger this function is called
          }
        )(root, args, context, info); // Subscription must return Async Iterable. According to this statement, we call withFilter Function
      },
    },
  },
};
