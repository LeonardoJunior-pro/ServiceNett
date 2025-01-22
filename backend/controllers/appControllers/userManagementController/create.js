const mongoose = require('mongoose');

const Model = mongoose.model('User');

const create = async (req, res) => {
  try {
    let body = req.body;

    if (req.body.password !== req.body.confrimpassword) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Confirm Pssword is not correct.',
      });
    }

    body['createdBy'] = req.admin._id;

    // Creating a new document in the collection
    const result = await new Model(body).save();

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: result,
      message: 'User created successfully',
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
