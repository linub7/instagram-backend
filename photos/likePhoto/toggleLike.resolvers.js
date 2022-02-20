import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    toggleLike: protectedResolver(async (_, { photoId }, { loggedInUser }) => {
      const existingPhoto = await client.photo.findUnique({
        where: { id: photoId },
      });
      if (!existingPhoto) {
        return {
          ok: false,
          error: 'Photo not Found',
        };
      }
      const like = await client.like.findUnique({
        where: {
          photoId_userId: {
            userId: loggedInUser.id,
            photoId,
          },
        },
      });
      if (like) {
        await client.like.delete({
          where: {
            photoId_userId: {
              userId: loggedInUser.id,
              photoId,
            },
          },
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            photo: {
              connect: {
                id: existingPhoto.id,
              },
            },
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};
