module.exports = (app) => {
  app.post('/files/logo', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.send(400);
    }
    console.log(req.files);
    res.send(200);
  });
  app.options('/files/logo', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send(200);
  });
}