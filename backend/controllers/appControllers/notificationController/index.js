const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Notification');

const sendMail = require('./mailController');
const create = require('./create');
const update = require('./update');
const paginatedList = require('./paginatedList');
const upcoming = require('./upcoming');
// const read = require('./read');
// const allList = require('./all');
const summary = require('./summary');
const duringFilter = require('./duringFilter');

methods.sendMail = sendMail;
methods.list = paginatedList;
methods.create = create;
methods.update = update;
methods.upcoming = upcoming;
methods.summary = summary;
methods.duringFilter = duringFilter;

module.exports = methods;
