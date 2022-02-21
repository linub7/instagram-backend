import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { commentId }, { loggedInUser }) => {
        const comment = await client.comment.findUnique({
          where: { id: commentId },
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: 'Comment not Found!',
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error:
              'You can not perform this action. You can only delete your own comments.❗',
          };
        } else {
          await client.comment.delete({ where: { id: commentId } });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};
