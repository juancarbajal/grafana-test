const dotenv = require('dotenv').config();
const express = require('express');

const app = express();
const TREBLE_URL = process.env.TREBLE_URL;
const TREBLE_API_KEY = process.env.TREBLE_API_KEY;
const TREBLE_POLL_ID = process.env.TREBLE_POLL_ID;
const PHONES = process.env.PHONES || "";
const PORT = process.env.PORT || 3000;

app.use(express.json());

class Treble {
  constructor(url, apikey) {
    this.url = url;
    this.apikey = apikey;
  }
  
  formatData(phoneStringList, additionalInfo) {
    const user_session_keys = [
      {"key": "title", "value": additionalInfo["title"] || "-"},
      {"key": "valueString", "value": additionalInfo["valueString"] || "-"},
      {"key": "dashboardURL", "value": additionalInfo["dashboardURL"] || "-"},
      {"key": "panelURL", "value": additionalInfo["panelURL"] || "-"},
      {"key": "deployment_squad", "value": "DS_14159803370"}
    ];
    // const user_session_keys = Object.entries(additionalInfo).map(([key, value]) => ({key, value}));
    const users = phoneStringList.replace(" ", "").split(",").map((u) => {
      const [country_code, cellphone] = u.split("-");
      return {cellphone, country_code, user_session_keys};
    });
    return {users};
  }

  sendMessage(pollId, phones, additionalInfo){
    const data = this.formatData(phones, additionalInfo);
    const stringData = JSON.stringify(data);
    console.log(stringData);
    return new Promise((resolve,reject) => {
      // 'Content-Length': Buffer.byteLength(stringData)
      fetch(this.url + pollId
            , {
              method: 'POST',
              body: stringData,
              headers: {
                'Accept': 'application/json',
                'Authorization': this.apikey,
                'Content-Type': 'application/json'
              }
            })
        .then(res => {
          console.log(res);
          resolve({statusCode: res.statusCode, body: JSON.stringify(res.data)});})
        .catch(error => {reject("Treble error: " + (error.code ? error.code : error));});
    });
  };
}



const validateFields = (req, res, next) => {
  if (!req.body.title) return res.status(400).send('Missing Title');
  next();
};

const sendMessage = (req, res, next) => {
  if (!req.body.title.includes('FIRING')) { // only send message firing 
    res.end("No message");
  } else {
    const treble = new Treble(TREBLE_URL, TREBLE_API_KEY);
    const defaultValues = {
      alertName : req.body.commonLabels.alertname,
      instance : req.body.commonLabels.instance,
      title : req.body.title,
      summary : req.body.commonAnnotations.summary
    };
    req.body.alerts.forEach((alert, index) => {
      delete(alert.annotations);
      delete(alert.labels);
      const mergedAlert = {...alert, ...defaultValues};
      treble.sendMessage(TREBLE_POLL_ID, PHONES, mergedAlert)
        .then((result) => console.log(result));
      console.log("MSG sended");
    });
  }
};

app.post('/message', validateFields, sendMessage);

app.get('/health', (req, res) => {res.send("OK" );});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
