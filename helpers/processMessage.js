const API_AI_TOKEN = process.env.API_AI_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);

const FB_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const request = require('request');

const sendMessage = (senderId, payload) => {
  return new Promise( (resolve, reject) => {

    //request to send a response to the user
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
    resolve();
  });
};

module.exports = (event) => {

  const senderId = event.sender.id;
  const senderMessage = event.message.text;

  // get a response form Dialogflow after it processes the user message
  const apiaiSession = apiAiClient.textRequest(senderMessage, {sessionId: 'interview_bot' });

  //callback on the response from Dialogflow
  apiaiSession.on('response', (response) => {

    //needs to be formatted according to the FB API
    payload = {};

    const result = response.result.fulfillment.speech;
    console.log(result);

    //if one part, plain text response
    if(result){
      payload.text = result;
      sendMessage(senderId, payload);
      payload = {};
    }
    // if multiple part, text + file/image response
    else{

      const messages = response.result.fulfillment.messages; //array of JSONs
      console.log(JSON.stringify(messages));

      for(message of messages){
        console.log(JSON.stringify(message));

        switch(message.type){

          case 0: // plain text
          payload.text = message.speech;
          break;

          case 3: //image
          payload.attachment = {
            type: "image",
            payload: {
              url: "" + message.imageUrl,
              is_reusable: true
            }
          };
          break;

          case 4: //file
          payload.attachment = {
            type: "file",
            payload: {
              attachment_id: "" + message.payload.attachment_id
            }
          };
          break;
        }//end switch

        sendMessage(senderId, payload);
        
        payload = {};

      }//end for
    }

  });

  apiaiSession.on('error', error => console.log(error));

  apiaiSession.end();
};
