module.exports = (app) => {
  app.post('/files/logo', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.send(400);
    }
    console.log(req.files);
    res.send(200);
  });
}