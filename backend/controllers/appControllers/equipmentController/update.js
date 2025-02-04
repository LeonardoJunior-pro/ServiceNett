const mongoose = require('mongoose');

const Model = mongoose.model('Equipment');

const update = async (req, res) => {
  try {
    let body = req.body;

    // Find document by id and updates with the required fields
    let result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
      new: true, // return the new result instead of the old one
    }).exec();

    console.log("req.params.id =>", req.params.id);
    result = await Model.find({ _id: req.params.id, removed: false })
      .populate('createdBy', 'name');

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: result[0],
      message: 'Equipment updated successfully',
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
module.exports = update;
