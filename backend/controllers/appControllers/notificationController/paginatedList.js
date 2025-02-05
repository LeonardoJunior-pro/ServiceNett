const mongoose = require('mongoose');

const Model = mongoose.model('Notification');
const EquipmentModel = mongoose.model('Equipment');

const CreateController = require('./create');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    const equipments = await EquipmentModel.find({ removed: false });
    for (let i = 0; i < equipments.length; i++) {
      const isExist = await Model.find({ equipment: equipments[i]._id });
      if (isExist.length == 0) await CreateController(equipments[i]);
    }

    //  Query the database for a list of all results
    const resultsPromise = Model.find({ removed: false })
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
        // pagination,
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

module.exports = paginatedList;
