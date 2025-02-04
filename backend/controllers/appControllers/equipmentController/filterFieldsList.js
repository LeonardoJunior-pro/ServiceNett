const mongoose = require('mongoose');

const Model = mongoose.model('Equipment');
const CustomerModel = mongoose.model('Customer');

const filterFieldsList = async (req, res) => {
  try {
    //  Query the database for a list of unique equipment name
    const euipmentFilterPromise = Model.distinct('name');
    const serialFilterPromise = Model.distinct('serial');
    const contactFilterPromise = CustomerModel.distinct('contacts.name');

    const [euipmentFilter, serialFilter, contactFilter] = await Promise.all([euipmentFilterPromise, serialFilterPromise, contactFilterPromise]);

    return res.status(200).json({
      success: true,
      isLoading: true,
      result: {
        equipment: euipmentFilter,
        serial: serialFilter, 
        contact: contactFilter
      },
      message: 'Successfully get filter fileds',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      equipment: {},
      contact: {},
      message: error.message,
      error: error,
    });
  }
};

module.exports = filterFieldsList;
