import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const protectedResolver =
  (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: 'Please login to perform this action',
      };
    }
    return ourResolver(root, args, context, info);
  };

/**
 * export function protectedResolver(ourResolver) {
 *    return function(root, args, context, info) {
 *        if(!context.loggedInUser) {
 *            return {
 *                ok: false,
 *                error: "Please Login to perform this action"
 *            }
 *        }
 *        return ourResolver(root, args, context, info)
 *    }
 * }
 */
