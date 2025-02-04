const mongoose = require('mongoose');

const Model = mongoose.model('Notification');

const logList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const startDate = new Date();
    const resultsPromise = Model.find({ removed: false, date: { $lte: startDate } })
      .sort({ created: 'desc' })
      .populate({
        path: 'equipment',
        populate: {
          path: 'createdBy',
          model: 'Customer',
        },
      });
    // Counting the total documents
    const countPromise = Model.countDocuments({ removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
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

module.exports = logList;
