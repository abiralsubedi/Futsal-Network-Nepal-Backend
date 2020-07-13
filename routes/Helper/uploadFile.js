const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { S3 } = require("aws-sdk");
const {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  SESSION_TOKEN
} = process.env;

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  sessionToken: SESSION_TOKEN
});

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../", "public/images")),
  filename: (req, file, cb) => {
    const filePath = path.parse(file.originalname.replace(/\s/g, "_"));
    cb(null, `${filePath.name}-${Date.now()}${filePath.ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 ** 2 // 1 MB
  }
});

module.exports = async (req, res) => {
  try {
    upload.single("file")(req, res, async error => {
      const { filename, path: filePath, mimetype } = req.file;

      fs.readFile(filePath, (err, fileData) => {
        const params = {
          Bucket: `${AWS_BUCKET_NAME}/images`,
          Key: `${filename}`,
          Body: fileData,
          ContentType: mimetype,
          ACL: "public-read"
        };

        s3.upload(params, async (s3Error, s3data) => {
          if (s3Error) throw new Error("Upload failed");
          const { key } = s3data;

          fs.unlink(filePath, () => {});
          res.json({ url: `/${key}` });
        });
      });
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
