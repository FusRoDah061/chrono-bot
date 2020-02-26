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

  const response = await fetch('http://api.chrono.gg/quest/spin', {
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`
    }
  });

  if(response.status === 200) {
    const json = await response.json();
    flipResult = {
      value: json.quest.value + json.quest.bonus,
      status: true,
      httpStatus: response.status
    }

    if(json.chest && Object.keys(json.chest).length > 0) 
      flipResult.chest = {
        value: json.chest.base + json.chest.bonus,
        kind: json.chest.kind
      }
  }
  else {
    let text = await response.text();
    flipResult = {
      value: -1,
      chest: null,
      status: false,
      httpStatus: response.status,
      error: response.status === 420 ? 'Already spun' : text
    }
  }

  console.log(flipResult);
  return flipResult;
}

function getChestTier(chestKind) {
  switch (chestKind) {
    case 0:
      return 'starter';

    case 3:
      return 'common';

    case 7:
      return 'rare';

    case 14:
      return 'epic';

    case 30:
      return 'legendary';
  }
}

async function reportStatus(flipResult, token) {
  const response = await fetch('http://api.chrono.gg/account', {
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`
    }
  });

  const json = await response.json();
  
  let emailBody = `
  <div style="background: #220f33;font-family: Roboto,sans-serif;color: #f1f1f1; text-align: center;padding:50px 0px;">
    <a href="https://www.chrono.gg" target="_blank">
      <img src="https://www.chrono.gg/assets/images/logo--header.4c9abc7e.svg">
    </a>
    
    <h1 style="color: #ffc534; text-transform:uppercase;border-bottom: 2px solid #4a346a;border-top: 2px solid #4a346a;background-color: rgba(74,53,106,.45);padding: 6px 0px;">Daily coin flipped!</h1>
    
    <p style="font-size: 16px;">
      This flip earned you 
      <span style="font-size: 16px; color: #ffc534; font-weight: 500;">
        <img height="16" width="16" src="https://www.chrono.gg/assets/images/coins/coin--1.76ce3c14.png">
        ${flipResult.value} coins
      </span>
    </p>

    <p style="font-size: 16px;">
      Your current balance is
      <span style="font-size: 20px; color: #ffc534; font-weight: 500; margin-top: 10px; margin-bottom: 10px; display: block;">
        <img height="20" width="20" src="https://www.chrono.gg/assets/images/coins/coin--1.76ce3c14.png">
        ${json.coins.balance} coins
      </span>
    </p>
  `;

  if(flipResult.chest) {
    emailBody += `
    <p style="font-size: 16px;margin-top: 50px;">Today's flip also rewarded you with a...</p>
    <img width="250" style="display: block; margin: auto; margin-bottom: 10px;" src="https://www.chrono.gg/assets/images/chests/chestModalHeader--${flipResult.chest.kind}.png">
    <img style="display: block; margin: auto;" height="70" width="70" src="https://www.chrono.gg/assets/images/chests/${getChestTier(flipResult.chest.kind)}Chest--58.png">

    <p style="font-size: 16px;">
      with
      <span style="font-size: 16px; color: #ffc534; font-weight: 500;">
        <img height="16" width="16" src="https://www.chrono.gg/assets/images/coins/coin--1.76ce3c14.png">
        ${flipResult.chest.value} coins
      </span>
      inside!
    </p>
    `;
  }

  emailBody += '</div>';

  await sendNotificationEmail(
    process.env.NOTIFICATION_EMAL, 
    'Chrono.gg bot just flipped a coin for you!',
    emailBody
  );
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