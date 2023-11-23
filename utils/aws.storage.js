const AWS = require("aws-sdk");
const sharp = require("sharp");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID_AWS,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
});

//to send in aws s3
module.exports.uploadImgAws = async (file, nameUnik) => {
  const resizeImg = await sharp(file.buffer).resize(1080, 1080).toBuffer();
  const params = {
    Bucket: "image-random",
    Key: `api-random-img-${nameUnik}.jpg`,
    Body: resizeImg,
    ContentType: file.mimetype,
  };
  return await s3.upload(params).promise();
};

//to delete in aws s3
module.exports.deleteImgAws = async (name) => {
  const params = {
    Bucket: "image-random",
    Key: name,
  };
  return await s3.deleteObject(params).promise();
};

//get
module.exports.getAllImages = async (res) => {
  const params = {
    Bucket: "image-random",
  };
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log(
        "Erreur lors de la liste des objets dans le compartiment S3 : ",
        err
      );
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des images." });
    } else {
      const imageList = data.Contents.map((object) => {
        return {
          imageUrl: `https://image-random.s3.eu-west-3.amazonaws.com/${object.Key}`,
          key: object.Key, // Vous pouvez également inclure d'autres propriétés selon vos besoins
        };
      });

      return res.status(200).json({ images: imageList });
    }
  });
};

//get random img in bucket
module.exports.getItemRandom = async (res) => {
  const params = {
    Bucket: "image-random",
  };
  await s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log("======le err=======================");
      console.log(err);
      console.log("====================================");
    } else {
      const randomObject = getOneRandom(data.Contents);
      //on envoie directement le lien :
      return res.status(200).json({
        image: `https://image-random.s3.eu-west-3.amazonaws.com/${randomObject.Key}`,
      });
    }
  });
};

//select un objet aleatoire
function getOneRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
