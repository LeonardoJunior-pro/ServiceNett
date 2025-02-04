const mongoose = require('mongoose');

const Model = mongoose.model('Equipment');
const NotificationModel = mongoose.model('Notification');
const CustomerModel = mongoose.model('Customer');

const remove = async (req, res) => {
  try {
    let updates = {
      removed: true,
    };
    // Find the document by id and delete it
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    await NotificationModel.findOneAndUpdate(
      { equipment: req.params.id, removed: false, status: 'pending'},
      { sort: {date: "desc"}},
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    await CustomerModel.updateMany(
      { equipments: req.params.id }, // Find customers where equipment contains the ID
      { $pull: { equipments: req.params.id } } // Remove the specific equipment ID from the array
    );

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document by this id: ' + req.params.id,
    });
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    console.log(error);
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
  }
};
module.exports = remove;
