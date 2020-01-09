const { uploadFile } = require('../../s3');
module.exports = (app) => {
  app.post('/upload/logo', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.send(400);
    }
    try {
      let file = await uploadFile(req.files.file.name, req.files.file.data);
      res.send({
        url: file.Location,
      });
    } catch (e) {
      console.log(e);
      res.send(500);
    }
  });
}