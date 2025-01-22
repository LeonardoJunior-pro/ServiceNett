const mongoose = require('mongoose');

const Model = mongoose.model('User');

const allList = async (req, res) => {
  try {
    //  Query the database for a list of all results
    const resultsPromise = Model.find({ removed: false })
      .sort({ created: 'desc' })
      .populate('createdBy', 'name');
    // Counting the total documents
    const countPromise = Model.countDocuments({ removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = allList;
