import cloudinary from 'cloudinary';

// config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, userId) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const customAvatarName = `${userId}-${Date.now()}-${filename}`;
  // await cloudinary.uploader
  //   .upload(readStream, {
  //     public_id: customAvatarName,
  //     resource_type: 'auto', // jpg, png
  //   })
  //   .promise();
  // return '';
  return new Promise((resolve, reject) => {
    const cloudStream = cloudinary.v2.uploader.upload_stream(function (
      err,
      fileUpload
    ) {
      if (err) {
        reject(err);
      }
      resolve(fileUpload);
    });
    readStream.pipe(cloudStream);
  });
};
