import client from '../../client';
import { uploadToCloudinary } from '../../shared/shared.utils';
import { protectedResolver } from '../../users/users.utils';
import { processHashtag } from '../photos.utils';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          // parse caption
          // get or  create Hashtags
          hashtagObj = processHashtag(caption);
          console.log(hashtagObj);
        }
        const stream = await uploadToCloudinary(file);
        const photoUrl = stream.secure_url;
        return client.photo.create({
          data: {
            file: photoUrl,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });

        // save the photo with the parsed hashtags
        // add the photo to the hashtags
      }
    ),
  },
};
