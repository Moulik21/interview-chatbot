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

const sendMessage = (senderId, payload) => {

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_ACCESS_TOKEN },
    method: 'POST',
    json: {
      messaging_type: "RESPONSE",
      recipient: { id: senderId },
      message: payload ,
    }
  });
};

module.exports = (event) => {
  console.log(JSON.stringify(event));
  const senderId = event.sender.id;
  const senderMessage = event.message.text;

  const apiaiSession = apiAiClient.textRequest(senderMessage, {sessionId: 'interview_bot' });

  apiaiSession.on('response', (response) => {

    console.log(JSON.stringify(response));
    var payload = {};

    const result = response.result.fulfillment.speech;
    console.log(result);

    //if one part, plain text response
    if(result){
      payload.text = result;
      sendMessage(senderId, payload);
    }
    // if multiple part, text + file/image response
    else{
      const messages = response.result.fulfillment.messages;
      console.log(JSON.stringify(messages));
      for(message in messages){
        switch(message.type){
          case 0: // plain text
          payload["text"] = message.speech;
          console.log("logging payload.text: "  + payload.text);
          break;
          case 3: //image
          payload["attachment"] = {
            "type": "image",
            "payload": {
              "url": "" + message.imageUrl,
              "is_reusable": true
            }
          };
          console.log("logging payload.attachment.payload.url: "  + payload.attachment.payload.url);
          break;
          case 4: //file
          payload["attachment"] = {
            "type": "file",
            "payload": {
              "url": "" + message.fileUrl,
              "is_reusable": true
            }
          };
          console.log("logging payload.attachment.payload.url: "  + payload.attachment.payload.url);
          break;
        }//end switch

        sendMessage(senderId, payload);
      }//end for
    }

  });

  apiaiSession.on('error', error => console.log(error));

  apiaiSession.end();
};
