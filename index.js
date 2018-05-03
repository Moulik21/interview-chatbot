const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('port', (process.env.PORT || 3000));

app.get('/', (req,res) => {
  res.status(200).send("Hello world!");

});
// use port 3000 unless there exists a preconfigured port
var port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log('Webhook server is listening on port ' + port);
})
