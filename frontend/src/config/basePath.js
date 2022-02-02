export const baseUploadImg = (filename) => {
  const baseDir = "http://localhost:5000/public/uploads/images/";
  return baseDir + filename;
}