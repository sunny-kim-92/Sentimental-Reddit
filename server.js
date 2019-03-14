const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const rp = require("request-promise")

// const AYLIENTextAPI = require('aylien_textapi');
// const textapi = new AYLIENTextAPI({
//   application_id: "f360d283",
//   application_key: "92b9c78e0bbfdc74cb64b7273d3dc431"
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/tp', (req, res) => {
  rp({
      method: "POST",
      uri: "http://text-processing.com/api/sentiment/",
      body: req.body,
      json: true
  })
  .then((req, res) => {
      console.log('yeah')
      console.log(res.body)
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));