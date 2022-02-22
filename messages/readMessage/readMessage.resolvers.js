import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    readMessage: protectedResolver(
      async (_, { messageId }, { loggedInUser }) => {
        const message = await client.message.findFirst({
          where: {
            id: messageId,
            userId: { not: loggedInUser.id },
            room: { users: { some: { id: loggedInUser.id } } },
          },
          select: {
            id: true,
          },
        });
        if (!message) {
          return {
            ok: false,
            error: 'message not found.',
          };
        }
        await client.message.update({
          where: { id: messageId },
          data: { read: true },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
