import client from '../../client';
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    followUser: protectedResolver(async (_, { username }, { loggedInUser }) => {
      const userToFollow = await client.user.findUnique({
        where: {
          username,
        },
      });
      if (!userToFollow) {
        return {
          ok: false,
          error: 'There is no account with this username',
        };
      }
      await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          following: {
            connect: {
              username,
            },
          },
        },
      });
      return { ok: true };
    }),
  },
};
