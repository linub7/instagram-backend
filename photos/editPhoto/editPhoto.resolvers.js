import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { processHashtag } from '../photos.utils';

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        // const photo = await client.photo.findUnique({ where: { id } });
        // if (photo.userId !== loggedInUser.id) {
        //     return {
        //         ok: false,
        //         error: 'You can only edit your own photos.'
        //     }
        // }
        // another way
        const oldPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: {
            hashtags: { select: { hashtag: true } },
          },
        });
        if (!oldPhoto) {
          return {
            ok: false,
            error: 'Photo not found',
          };
        }

        await client.photo.update({
          where: { id }, // in update mode => where work with unique fields
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtag(caption),
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
