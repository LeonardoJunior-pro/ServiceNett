const mongoose = require('mongoose');
const notificationController = require('@/controllers/appControllers/notificationController');

const Model = mongoose.model('Equipment');

const create = async (req, res) => {
  try {
    let body = req.body;

    // Creating a new document in the collection
    const result = await new Model(body).save();
    await notificationController.create(result);
    // const updateResult = await Model.findOneAndUpdate(
    //   { _id: result._id },
    //   { equipments: equipment_IDs },
    //   {
    //     new: true,
    //   }
    // ).exec();

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: result,
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
