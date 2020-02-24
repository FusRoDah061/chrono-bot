const fetch = require('node-fetch');
const nodeMailer = require('nodemailer');
require('dotenv').config();

async function sendNotificationEmail (to, subject, html) {
  
  if(!to) return;

  console.log(`Sending email to "${to}" with subject "${subject}"`);

  let transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  let mailOptions = { to, subject, html };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  }
  catch(err) {
    console.log('Error sending email:');
    console.error(err);
  }
}

async function flipCoin(token) {
  let flipResult = {};

  const response = await fetch('https://api.chrono.gg/quest/spin', {
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`
    }
  });

  if(response.status === 200) {
    let json = await response.json();
    flipResult = {
      value: json.quest.value + json.quest.bonus,
      status: true,
      httpStatus: response.status
    }

    if(json.chest) 
      flipResult.chest = {
        value: json.chest.base + json.chest.bonus,
        kind: json.chest.kind
      }
  }
  else {
    let text = await response.text();
    flipResult = {
      value: -1,
      chest: {},
      status: false,
      httpStatus: response.status,
      error: response.status === 420 ? 'Already spun' : text
    }
  }

  console.log(flipResult);
  return flipResult;
}

async function reportStatus(flipResult, token) {
  
}

async function run() {
  let token = process.env.CHRONO_JWT_TOKEN;
  
  if(!token) {
    console.log("Undefined token.");
    await sendNotificationEmail(process.env.NOTIFICATION_EMAL, 'Chrono.gg JWT token not set', 'JWT token for chrono.gg authentication is not set.');
    return false;
  }

  console.log("Token: ", token);

  let flipResult = await flipCoin(token);
  await reportStatus(flipResult, token);

  return true;
}


(async function () { 
  try{
    await run(); 
    console.log('Execution finished successfuly');
  } 
  catch(err) {
    console.log('Execution error: ', err);
  }
  
  process.exit(0);
})();