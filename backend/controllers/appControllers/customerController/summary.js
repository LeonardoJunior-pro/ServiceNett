const mongoose = require('mongoose');

const Model = mongoose.model('Customer');

const summary = async (req, res) => {
  try {
    //  Query the database for a list of all results
    const resultsPromise = Model.find({ removed: false })
      .sort({ created: 'desc' })
      .populate('createdBy', 'name');
    // Resolving both promises
    const [result ] = await Promise.all([resultsPromise]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        isLoading: true,
        result: result.length,
        message: 'Successfully Count all documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        isLoading: true,
        result: 0,
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      isLoading: false,
      result: 0,
      message: error.message,
      error: error,
    });
  }
};

module.exports = summary;
