const mongoose = require('mongoose');

const Model = mongoose.model('Notification');

const duringFilter = async (req, res) => {
  try {
    const requestedDate = new Date(req.query.during);
    const year = requestedDate.getFullYear();
    const month = requestedDate.getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    //  Query the database for a list of all results
    const resultsPromise = Model.find({
      removed: false,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ date: 'desc' })
      .populate({
        path: 'equipment',
        populate: {
          path: 'createdBy',
          model: 'Customer',
        },
      });
    // Resolving both promises
    const [result] = await Promise.all([resultsPromise]);

    const filterResult = result.filter(
      (item, index, self) => 
        index === self.findIndex((t) => new Date(t.date).getDate() === (new Date(item.date).getDate()))
    );

    return res.status(200).json({
      success: true,
      result: filterResult,
      message: 'Successfully during filter',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = duringFilter;
