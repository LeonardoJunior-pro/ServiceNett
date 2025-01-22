const mongoose = require('mongoose');

const Model = mongoose.model('Notification');

const summary = async (req, res) => {
  try {
    //  Query the database for a list of all results
    const startDate = new Date();
    const startDay = startDate.getDay();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (7 - startDay));

    const resultsPromise = Model.find({
      date: { $gte: startDate, $lte: endDate },
      status: 'pending',
      removed: false,
    })
      .sort({ date: 'asc' });

    // Resolving both promises
    const [result] = await Promise.all([resultsPromise]);

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
