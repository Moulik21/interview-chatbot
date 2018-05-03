const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// use port 3000 unless there exists a preconfigured port
var port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log('Webhook server is listening on port ' + port);
})
