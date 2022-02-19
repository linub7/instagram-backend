import client from '../../client';
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    unFollowUser: protectedResolver(
      async (_, { username }, { loggedInUser }) => {
        const userToFollow = await client.user.findUnique({
          where: {
            username,
          },
        });
        if (!userToFollow) {
          return {
            ok: false,
            error: 'can not unfollow user',
          };
        } else {
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                disconnect: {
                  username,
                },
              },
            },
          });
          return { ok: true };
        }
      }
    ),
  },
};
