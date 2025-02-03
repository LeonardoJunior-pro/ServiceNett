const mongoose = require('mongoose');

const Model = mongoose.model('Equipment');
const CustomerModel = mongoose.model('Customer');

const filterFieldsList = async (req, res) => {
  try {
    //  Query the database for a list of unique equipment name
    const euipmentFilterPromise = Model.distinct('name');
    const contactPromise = CustomerModel.distinct('contacts.name');

    const [euipmentFilter, contact] = await Promise.all([euipmentFilterPromise, contactPromise]);

    return res.status(200).json({
      success: true,
      isLoading: true,
      result: {
        equipment: euipmentFilter, 
        contact: contact
      },
      message: 'Successfully get filter fileds',
    });

    if (euipmentFilter.length > 0 || contact.length > 0) {
      return res.status(200).json({
        success: true,
        equipment: euipmentFilter,
        contact: contact,
        message: 'Successfully get filter fileds',
      });
    } else {
      return res.status(203).json({
        success: true,
        equipment: {},
        contact: {},
        message: 'Collection is Empty',
      });
    }
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
