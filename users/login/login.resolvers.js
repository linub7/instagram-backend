import client from '../../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      try {
        // find user with args.username
        const user = await client.user.findFirst({ where: { username } });
        if (!user) {
          return {
            ok: false,
            error: 'User not Found',
          };
        }
        // check password with args.password
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          return {
            ok: false,
            error: 'Incorrect Password',
          };
        }
        // issue a token and sent it to the user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        return {
          ok: true,
          token,
        };
      } catch (err) {
        return err;
      }
    },
  },
};
