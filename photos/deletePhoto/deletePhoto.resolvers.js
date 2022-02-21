import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { photoId }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: { id: photoId },
        select: { userId: true },
      });
      if (!photo) {
        return {
          ok: false,
          error: 'Photo not Found',
        };
      } else if (photo.userId !== loggedInUser.id) {
        return {
          ok: false,
          error:
            'You can not perform this action. You can only delete your own photos.❗',
        };
      } else {
        await client.photo.delete({ where: { id: photoId } });
        return {
          ok: true,
        };
      }
    }),
  },
};
