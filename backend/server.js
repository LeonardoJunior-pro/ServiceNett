require('module-alias/register');
const mongoose = require('mongoose');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 16 || (major === 16 && minor < 20)) {
  console.log('Please upgrade your node.js version at least 16.20.2 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const glob = require('glob');
const path = require('path');

glob.sync('./models/**/*.js').forEach(function (file) {
  require(path.resolve(file));
});

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8888);

// const server = app.listen(app.get('port'), () => {
//   console.log(`Express running → On PORT : ${server.address().port}`);
// });


const server = app.listen(app.get('port'), async () => {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.DATABASE);
    console.log(`Express running → On PORT : ${server.address().port}`);
  } catch (error) {
    console.log(error)
    console.log("mongodb connect error")
  }
});
