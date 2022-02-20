import client from '../../client';

export default {
  Query: {
    seePhoto: (_, { photoId }) =>
      client.photo.findUnique({ where: { id: photoId } }),
  },
};
