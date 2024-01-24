const axios = require('axios');
const { subscriptionMessagespollIds } = require('./constants/subscriptionMessagespollIds');

exports.handler = async (event) => {
    console.log('Treble new message', event.body);
    let response = {
      statusCode: 500
    };
    
    if (event.body === null && event.body === undefined) {
      response.body =  'Undefined request body';
    } else if (JSON.parse(event.body).users === undefined) {
      response.body = 'Undefined property users in request body';
    } else {
      const body = JSON.parse(event.body);
      const users = setRemitentPhoneNumberToUsers(body.users, body.poll_id);
      const data = formatUsersData(users);
      try {
        response = await sendWhatsappMessage(body.poll_id, data);
        console.log('Sended sucessfully to Treble', response, event.body);
      } catch (errorMessage) {
        console.error(response, event.body);
        response.body = errorMessage;
      }
    }
    
    return response;
};


function setRemitentPhoneNumberToUsers(users, pollId){
    let remitentPhoneNumber = "DS_14159803370";

    if (subscriptionMessagespollIds.includes(pollId)) {
        remitentPhoneNumber = "DS_14146625341";
    }

    users.map((user) => {
        user.deployment_squad = remitentPhoneNumber;
    });

    return users;
}

function sendWhatsappMessage(pollId, data){
  console.log('Data:', data);
  const stringData = JSON.stringify(data);
  const options = {
    method: 'POST',
    body: stringData,
    headers: {
        'Accept': 'application/json',
        'Authorization': process.env.TREBLE_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(stringData)
    }
  };

  return new Promise((resolve, reject) => {
    axios
    .post(`https://main.treble.ai/deployment/api/poll/${pollId}`, stringData, options)
    .then(res => {
      resolve({
          statusCode: res.statusCode,
          body: JSON.stringify(res.data)
      });
    })
    .catch(error => {
      reject("Treble error: " + (error.code ? error.code : error));
    });
  });
}

function formatUsersData(users){
  const usersData = users.map((user) => {
    return formatUserData(user);
  });
  return {
    "users": usersData
  };
}

function formatUserData(user){
  let sessionKeys = {...user};

  delete sessionKeys.cellphone;
  delete sessionKeys.countryCode;

  const userSessionKeys = formatUserSessionKeys(sessionKeys);
  return  { 
    "cellphone": user.cellphone,
    "country_code": user.countryCode,
    "user_session_keys": userSessionKeys
  };
}

function formatUserSessionKeys(keyValues){
  const sessionKeys = [];

  for (const [key, value] of Object.entries(keyValues)) {
    sessionKeys.push({
      "key": key, 
      "value": value
    });
  }

  return sessionKeys;
}
