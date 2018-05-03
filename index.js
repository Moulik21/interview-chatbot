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
var port = 3000 || process.env.PORT;

app.listen(app.get('port'), () => {
  console.log('Webhook server is listening on port ' + app.get('port'));
})
