const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('User');

const create = require('./create');
const update = require('./update');
const paginatedList = require('./paginatedList');
const read = require('./read');
// const allList = require('./all');

methods.list = paginatedList;
// methods.listAll = allList;
methods.read = read;

methods.create = create;
methods.update = update;

module.exports = methods;
