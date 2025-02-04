const mongoose = require('mongoose');

const Model = mongoose.model('Equipment');
const CustomerModel = mongoose.model('Customer');

const filterFieldsList = async (req, res) => {
  try {
    //  Query the database for a list of unique equipment name
    const euipmentFilterPromise = Model.find({ removed: false }).distinct('name');
    const serialFilterPromise = Model.find({ removed: false }).distinct('serial');
    const customerFilterPromise = CustomerModel.distinct('name');

    const [euipmentFilter, serialFilter, customerFilter] = await Promise.all([
      euipmentFilterPromise,
      serialFilterPromise,
      customerFilterPromise,
    ]);

    return res.status(200).json({
      success: true,
      isLoading: true,
      result: {
        equipment: euipmentFilter,
        serial: serialFilter,
        customer: customerFilter,
      },
      message: 'Successfully get filter fileds',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: {},
      message: error.message,
      error: error,
    });
  }
};

module.exports = filterFieldsList;
