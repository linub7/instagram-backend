import client from '../../client';
import bcrypt from 'bcrypt';
import { protectedResolver } from '../users.utils';
// import { createWriteStream } from 'fs';
import { uploadToCloudinary } from '../../shared/shared.utils';

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          const file = await uploadToCloudinary(avatar);
          avatarUrl = file.secure_url;
          // avatarUrl = await uploadToCloudinary(avatar, loggedInUser.id);
          // const { filename, createReadStream } = await avatar;

          // const customAvatarName = `${
          //   loggedInUser.id
          // }-${Date.now()}-${filename}`;
          // const readStream = createReadStream();
          // const writeStream = createWriteStream(
          //   process.cwd() + '/uploads/' + customAvatarName
          // );
          // readStream.pipe(writeStream);
          // avatarUrl = `http://localhost:4000/static/${customAvatarName}`;
        }
        let hashedPassword = null;
        if (newPassword) {
          hashedPassword = await bcrypt.hash(newPassword, 12);
        }
        const updatedUser = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(hashedPassword && { password: hashedPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
          },
        });
        if (updatedUser.id) {
          return { ok: true };
        } else {
          return {
            ok: false,
            error: 'Could not update Profile',
          };
        }
      }
    ),
  },
};
