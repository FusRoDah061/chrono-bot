const fetch = require('node-fetch');
const nodeMailer = require('nodemailer');
const log = require('./logger').getLogger('job');
require('dotenv').config();

async function sendNotificationEmail (to, subject, html) {
  
  if(!to) return;

  log.info('Sending email to ', to, ' with subject ', subject);

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
    log.info('Email sent')
  }
  catch(err) {
    log.error('Error sending email: ', err);
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

async function fetchAccountInformation(token) {
  const response = await fetch('http://api.chrono.gg/account', {
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`
    }
  });

  const json = await response.json();
  return json;
}

async function fetchGamesToClaim(balance, token) {
  console.log('Fetching games to claim');

  const response = await fetch('http://api.chrono.gg/shop', {
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`
    }
  });

  const json = await response.json();
  
  return json
    .filter(game => {
      return game.status === 'active' &&
             !game.sold_out && 
             game.price <= balance &&
             !game.purchased;
    })
    .sort((a, b) => {
      return a.price - b.price;
    });
}

async function reportStatus(flipResult, token) {
  
  let account = await fetchAccountInformation(token);
  let gamesToClaim = await fetchGamesToClaim(account.coins.balance, token);
  
  log.info('Account: ', account);
  log.info('Games to claim: ', gamesToClaim);

  let emailBody = `
  <div style="background: #220f33;font-family: Roboto,sans-serif;color: #f1f1f1; text-align: center;padding:50px 0px;">
    <a href="https://www.chrono.gg" target="_blank">
      <img width="250" src="https://www.chrono.gg/assets/images/branding/chrono-logo--light.a13125e1.png">
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
        ${account.coins.balance} coins
      </span>
    </p>
  `;

  if(flipResult.chest) 
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

  if(gamesToClaim.length > 0) {
    emailBody += `
      <h2 style="color: #ffc534; text-transform:uppercase;border-bottom: 2px solid #4a346a;border-top: 2px solid #4a346a;background-color: rgba(74,53,106,.45);padding: 6px 0px;">Games available</h2>
	
      <p style="font-size: 16px;">You can claim the following games right now!</p>
      
      <ul style="padding:0; width:345px; margin:auto;">`;

    for(game of gamesToClaim) 
      emailBody += `
        <li style="list-style:none; background: #4a366a; border-radius: 2px; padding-bottom: 10px; margin-bottom: 10px; margin-left: 0px;">
          <a style="color: white; text-decoration: none;" href="https://www.chrono.gg/shop">
            <img width="345" src="http://www.chrono.gg/assets/images/shop/${game.hash}/item-header.jpg">

            <span style="display:block; width:100%; height:6px; background:#ff934d; border:0; position:relative; margin:0; top:-3px;"></span>
            
            <p style="margin: 0; text-align: left; padding: 10px 15px; font-size: 16px;">${game.name}</p>
            
            <a style="color: white; text-decoration:none; font-size: 15px; margin-left: 15px; float: left; color: #fc0;" href="${game.url}" target="_blank">View game on Steam</a>

            <span style="background: rgba(221,192,255,.16); border-radius: 30px; padding: 5px 10px 4px; font-size: 14px; margin-right: 15px; float: right;">
              <img height="16" width="16" style="vertical-align: top;" src="http://www.chrono.gg/assets/images/coins/coin--1.76ce3c14.png">
              ${game.price}
            </span>
            <span style="display: block; clear:both;"></span>
          </a>
        </li>`;
    
    emailBody += '</ul>';
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
    log.fatal("Undefined access token.");
    await sendNotificationEmail(process.env.NOTIFICATION_EMAL, 'Chrono.gg JWT token not set', 'JWT token for chrono.gg authentication is not set.');
    return false;
  }

  log.info("Token: ", token);

  let flipResult = await flipCoin(token);

  log.debug('Flip coin result: ', flipResult);

  if(flipResult.value > 0)
    await reportStatus(flipResult, token);
  else  
    log.info('No coin was flipped');

  return true;
}

module.exports = { run: run };