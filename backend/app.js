const express = require('express');

const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const helpers = require('./helpers');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const { isValidAdminToken } = require('./controllers/coreControllers/authJwtController');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

const CronJob = require('cron').CronJob;
const notificationController = require('@/controllers/appControllers/notificationController');

// create our Express app
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// Enable CORS for multiple origins
// const allowedOrigins = ['https://dbd7-38-170-181-10.ngrok-free.app', process.env.SITE_URL];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           'The CORS policy for this site does not allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       if (!origin) return callback(null, true);
//       return callback(null, true);
//     },
//   })
// );

// setting cors at one place for all the routes
// putting cors as first in order to avoid unneccessary requests from unallowed origins

// app.use(function (req, res, next) {
//   if (req.url.includes('/api')) {
//     cors(corsOptions)(req, res, next);
//   } else {
//     cors()(req, res, next);
//   }
// });

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is

// Takes the raw requests and turns them into usable properties on req.body

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// pass variables to our templates + all requests

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api', isValidAdminToken, coreApiRouter);
app.use('/api', isValidAdminToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// notificationController.sendMail();

new CronJob('00 00 9 * * *', () => {
  try {
    console.log('Notification Crop Job run');
    notificationController.sendMail();
    notificationController.update();
  } catch (e) {
    console.log('Nofication Crop Job error : ', e);
  }
});

// done! we export it so we can start the site in start.js
module.exports = app;
