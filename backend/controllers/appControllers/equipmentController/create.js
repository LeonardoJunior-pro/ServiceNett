const mongoose = require('mongoose');
const notificationController = require('@/controllers/appControllers/notificationController');

const Model = mongoose.model('Equipment');
const CustomerModel = mongoose.model('Customer');

const create = async (req, res) => {
  try {
    let body = req.body;

    // Creating a new document in the collection
    let result = await new Model(body).save();
    await notificationController.create(result);
    await CustomerModel.updateOne(
      { _id: result.createdBy }, // Find the specific customer by ID
      { $push: { equipments: result._id } } // Add the new equipment ID to the array
    );
    result = await Model.find({ _id: result._id })
      .populate('createdBy', 'name');

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: result[0],
      message: 'Equipment created successfully',
    });
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
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
module.exports = create;
