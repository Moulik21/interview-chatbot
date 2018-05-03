/*

  "message": {
    "attachment": {
      "type": "file",
      "payload": {
        "url": "https://examples.dialogflow.com/RichMessagesFiles/LoremIpsum.pdf",
        "is_reusable": true
      }
    }
  }
   OR

   "message":{
    "text":"hello, world!"
  }

*/
const API_AI_TOKEN = process.env.API_AI_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);

const FB_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const request = require('request');

const sentMessage = (senderId, text) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      message: { text },
    }
  });
};

module.exports = (event) => {
  const senderId = event.sender.id;
  const message = event.message.text;

  const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'interview_bot' });

  apiaiSession.on('response', (response) => {
    	console.log(JSON.stringify(response));

    const result = response.result.fulfillment.speech;

    sendMessage(senderId, result);
  });

  apiaiSession.on('error', error => console.log(error));

  apiaiSession.end();
};
