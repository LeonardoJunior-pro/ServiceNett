const { SendEmailNotification, SendSMSNotification } = require('@/emailTemplate/Notification');
const mongoose = require('mongoose');
const NotificationModel = mongoose.model('Notification');
const SettingModel = mongoose.model('Setting');
const EmailTModel = mongoose.model('Email');

const { MailerSend, EmailParams, Sender, Recipient, SMSParams } = require('mailersend');

const sendMail = async () => {
  let email_setting = await SettingModel.find(
    { settingKey: 'email_enabled' },
    { _id: 0, settingValue: 1 }
  );
  let sms_setting = await SettingModel.find(
    { settingKey: 'sms_enabled' },
    { _id: 0, settingValue: 1 }
  );

  email_setting = email_setting[0] ? email_setting[0]['settingValue'] : false;
  sms_setting = sms_setting[0] ? sms_setting[0]['settingValue'] : false;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 2);

  const results = await NotificationModel.find({
    // date: { $gte: startDate, $lte: endDate },
    status: 'pending',
    removed: false,
  })
    .sort({ date: 'asc' })
    .populate({
      path: 'equipment',
      populate: {
        path: 'createdBy',
        model: 'Customer',
      },
    });

  for (let i = 0; i < results.length; i++) {
    const notification = results[i];
    const to_mail = notification['equipment']['createdBy']['email'];
    const to_sms = notification['equipment']['createdBy']['phone'];
    let from_mail = '';
    let from_sms = '';
    for (let j = 0; j < notification['equipment']['createdBy']['contacts'].length; j++) {
      const contactInfo = notification['equipment']['createdBy']['contacts'][i];
      if (contactInfo['name'] === notification['equipment']['contact']) {
        from_mail = contactInfo['email'];
        from_sms = contactInfo['phone'];
      }
    }
    const contact = notification['equipment']['contact'];
    const equipment = notification['equipment']['name'];
    const serial = notification['equipment']['serial'];
    const date = notification['date'];

    if (email_setting) {
      console.log('email_setting =>');
      sendViaEmailApi(from_mail, to_mail, contact, equipment, serial, date);
    }

    if (sms_setting) {
      console.log('sms_setting =>');
      // sendViaSMSApi(from_sms, to_sms, contact, equipment, serial, date);
    }
  }
};

const sendViaEmailApi = async (from, to, contact, equipment, serial, date) => {
  let title = '';
  let body = '';

  const results = await EmailTModel.find(
    {
      emailKey: 'email_template_default',
      removed: false,
    },
    { emailBody: 1, emailSubject: 1 }
  );

  if (results[0]) {
    title = results[0]['emailSubject'];
    body = results[0]['emailBody'];

    body = body.replace(/{{customer}}/g, 'customer');
    body = body.replace(/{{contact}}/g, contact);
    body = body.replace(/{{equipment}}/g, equipment);
    body = body.replace(/{{serial}}/g, serial);
    body = body.replace(/{{date}}/g, date);
  }

  const mailersend = new MailerSend({
    apiKey: process.env.API_KEY,
  });

  const sentFrom = new Sender(process.env.SENDER_MAIL, 'servicenett');

  const recipients = [new Recipient(to, 'Recipient')];

  const text = SendEmailNotification({ title, body, contact, equipment, serial, date });
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject('Equipment Calibration')
    .setHtml(text)
    .setText(text);

  try {
    await mailersend.email.send(emailParams);
    console.log('Sending mail successfully');
  } catch (e) {
    console.log(e);
  }

  return 'data';
};

const sendViaSMSApi = async (from, to, contact, equipment, serial, date) => {
  let title = '';
  let body = '';

  const results = await EmailTModel.find(
    {
      emailKey: 'sms_template_default',
      removed: false,
    },
    { emailBody: 1, emailSubject: 1 }
  );

  if (results[0]) {
    title = results[0]['emailSubject'];
    body = results[0]['emailBody'];

    body = body.replace(/{{contact}}/g, '${contact}');
    body = body.replace(/{{equipment}}/g, '${equipment}');
    body = body.replace(/{{serial}}/g, '${serial}');
    body = body.replace(/{{date}}/g, '${date}');
  }

  const text = SendSMSNotification({ title, body, contact, equipment, serial, date });

  const mailersend = new MailerSend({
    apiKey: 'mlsn.b2375f222ebafa19a38e0dd1651be05074f7edd774fc7639c4fe6de62e219fbb',
  });
  const recipients = [to];

  const smsParams = new SMSParams().setFrom(from).setTo(recipients).setText(text);

  try {
    await mailersend.email.send(smsParams);
    console.log('send sms successfully');
  } catch (error) {
    console.log('Error :', error);
  }
};

module.exports = sendMail;
