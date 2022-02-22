import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Query: {
    seeRoom: protectedResolver(async (_, { roomId }, { loggedInUser }) =>
      client.room.findFirst({
        where: {
          id: roomId,
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      })
    ),
  },
};
