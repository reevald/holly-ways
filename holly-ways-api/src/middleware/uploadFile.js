const multer = require("multer");
const path = require("path");

exports.uploadImage = (fieldNameForm, skipUpload=false) => {
  // define storage destination
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "public/uploads/images");
    },
    filename: function (req, file, callback) {
      // setting filename
      // Ref: https://stackoverflow.com/a/5365444
      callback(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    }
  });

  // filter file
  const fileFilter = (req, file, callback) => {
    if (file.fieldname === fieldNameForm) {
      if (!file.originalname.match(/\.(jpg|JPG|JPEG|jpeg|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed"
        };

        return callback(new Error("Only image files are allowed!", false));
      }
      callback(null, true);
    }
  }

  // maximum size for file upload
  const sizeInMB = 5;
  const maxSize = sizeInMB * 1024 * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize
    }
  }).fields([{
    name: fieldNameForm,
    maxCount: 4 // max file upload (can multiple file)
  }]);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // if file not exist
      if (!req.files && !err) {
        if (skipUpload) return next();
        
        return res.status(400).send({
          message: "Please select file to upload"
        });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized"
          });
        }
        return res.status(400).send(err);
      }
      console.log("File successfully uploaded");
      return next();
    });
  };
};