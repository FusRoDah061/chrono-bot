const fetch = require('node-fetch');
const nodeMailer = require('nodemailer');
const redis = require('./redis-promise');
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

async function run() {
  let token = process.env.CHRONO_JWT_TOKEN;
  
  if(!token) {
    console.log("Undefined token.");
    await sendNotificationEmail(process.env.NOTIFICATION_EMAL, 'Chrono.gg JWT token not set', 'JWT token for chrono.gg authentication is not set.');
    return false;
  }

  console.log("Token: ", token);

  //TODO

  return true;
}


(async function () { 
  try{
    await run(); 
    console.log('Excution finished successfuly');
  } 
  catch(err) {
    console.log('Execution error: ', err);
  }
  
  process.exit(0);
})();