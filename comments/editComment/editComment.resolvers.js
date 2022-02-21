import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    editComment: protectedResolver(
      async (_, { commentId, payload }, { loggedInUser }) => {
        const comment = await client.comment.findUnique({
          where: { id: commentId },
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: 'Comment not Found',
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error:
              'You can not perform this action. You can only edit your own comments.❗',
          };
        } else {
          await client.comment.update({
            where: { id: commentId },
            data: {
              payload,
            },
          });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};
