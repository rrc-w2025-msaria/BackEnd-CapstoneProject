import multer from "multer";

// config storage - for storing the uploaded files
const storage = multer.diskStorage({
  // this is the folder where the files will be saved
  destination: (req, file, cb) => {
    // cb mean callback - this tells multer that this is the folder to save the file to
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Date.now gives unique file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// multer instance
export const upload = multer({
  storage,
  limits: {
    // this limits the file to 5MB max
    fileSize: 1024 * 1024 * 5,
  },
});
