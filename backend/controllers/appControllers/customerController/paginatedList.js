const mongoose = require('mongoose');

const Model = mongoose.model('Customer');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    // const resultsPromise = Model.find({ removed: false })
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ created: 'desc' })
    //   .populate('createdBy', 'name');

    const resultsPromise = Model.aggregate([
      {
        $match: { removed: false } // Filter customers where removed is false
      },
      {
        $lookup: {
          from: 'equipment', // Reference the Equipment collection
          localField: 'equipments', // Field in Customer collection
          foreignField: '_id', // Matching _id in Equipment collection
          as: 'equipmentsData' // Store matched equipment data in an array
        }
      },
      {
        $addFields: {
          lastActivity: {
            $max: '$equipmentsData.updated' // Extract the latest updatedAt date
          }
        }
      },
      {
        $sort: { created: -1 } // Sort customers by created date (descending)
      },
      {
        $skip: skip // Pagination - Skip N documents
      },
      {
        $limit: limit // Pagination - Limit results
      },
    ]);
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

module.exports = paginatedList;
