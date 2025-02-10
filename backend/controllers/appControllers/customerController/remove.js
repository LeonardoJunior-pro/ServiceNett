const mongoose = require('mongoose');

const Model = mongoose.model('Customer');
const EquipmentModel = mongoose.model('Equipment');
const NotificationModel = mongoose.model('Notification');

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
    );

    if (result) {
      await EquipmentModel.updateMany(
        { _id: { $in: result.equipments }, removed: false },
        { $set: updates }
      );

      // await NotificationModel.updateMany(
      //   { equipment: { $in: result.equipments }, removed: false },
      //   { $set: updates }
      // );

      // await NotificationModel.deleteMany(
      //   { equipment: { $in: result.equipments }, removed: false },
      // );
    }

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: 'Equipment removed successfully',
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
