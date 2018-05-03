//Webhook server live at : https://mg-interview-chatbot.herokuapp.com/

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('port', (process.env.PORT || 3000));

// use port 3000 unless there exists a preconfigured port
var port = process.env.PORT || 3000;

app.listen(port,  () => {
  console.log('Webhook server is listening on port ' + port);
});

const verificationController = require('./controllers/verification');
//const messageController = require('./controllers/messageWebhook');

app.get('/', verificationController);
//app.post('/', messageController);
