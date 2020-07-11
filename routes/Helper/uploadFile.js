const { S3 } = require("aws-sdk");
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION } = process.env;

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: AWS_REGION
});

module.exports = async (req, res) => {
  try {
    const { fileUploadData } = req.body;
    console.log(fileUploadData, "data");
    res.json({
      url:
        "https://assets-devap.innovatetech.io/images/flower_52caf9a8-3aaa-467e-b0e0-1453638cc78c_980.jpg"
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
