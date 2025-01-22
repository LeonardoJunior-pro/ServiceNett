require('dotenv').config({ path: __dirname + '/../.env' });
require('dotenv').config({ path: __dirname + '/../.env.local' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
const fs = require('fs');

async function setupApp() {
  try {
    const Admin = require('../models/coreModels/Admin');
    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash('Termografi-99');

    await new Admin({
      email: 'Alex@ptnordic.no',
      password: passwordHash,
      name: 'Alex',
      surname: 'Alex',
      role: 'admin',
    }).save();

    console.log('👍 Admin created : Done!');

    const Setting = require('../models/coreModels/Setting');

    const appConfig = JSON.parse(fs.readFileSync(__dirname + '/config/appConfig.json', 'utf-8'));
    const companyConfig = JSON.parse(
      fs.readFileSync(__dirname + '/config/companyConfig.json', 'utf-8')
    );
    const financeConfig = JSON.parse(
      fs.readFileSync(__dirname + '/config/financeConfig.json', 'utf-8')
    );
    const crmConfig = JSON.parse(fs.readFileSync(__dirname + '/config/crmConfig.json', 'utf-8'));
    const customConfig = JSON.parse(
      fs.readFileSync(__dirname + '/config/customConfig.json', 'utf-8')
    );

    const moneyFormatConfig = JSON.parse(
      fs.readFileSync(__dirname + '/config/moneyFormatConfig.json', 'utf-8')
    );
    const generalConfig = JSON.parse(
      fs.readFileSync(__dirname + '/config/generalConfig.json', 'utf-8')
    );

    await Setting.insertMany([
      ...appConfig,
      ...companyConfig,
      ...financeConfig,
      ...crmConfig,
      ...moneyFormatConfig,
      ...customConfig,
      ...generalConfig,
    ]);
    console.log('👍 Settings created : Done!');

    const Email = require('../models/coreModels/Email');
    const emailTemplate = JSON.parse(
      fs.readFileSync(__dirname + '/config/emailTemplate.json', 'utf-8')
    );

    await Email.insertMany([...emailTemplate]);
    console.log('👍 Email Templates Created : Done !');
    console.log('🥳 Setup completed :Success!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}

setupApp();
