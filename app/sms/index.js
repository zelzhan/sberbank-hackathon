var sms = require('./smsc_api');

sms.configure({
  login: 'vk_510857',
  password: 'dauletdoka1'
})

sms.test((err) => {
  if(err) return console.log("SMS/Error: " + err)
})

module.exports = sms;