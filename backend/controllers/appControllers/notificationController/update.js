const mongoose = require('mongoose');

const Model = mongoose.model('Notification');
const EquipmentModel = mongoose.model('Equipment');

const update = async () => {
  try {
    const lt = new Date();
    // await Model().updateMany({ nextDate: { $lt: lt }, status: 'pending' }, [
    //   {
    //     $set: {
    //       nextDate: {
    //         $add: ['$Date', { $multiply: ['$interval', 30 * 24 * 60 * 60 * 1000] }], //  set the unit of cycle to one month
    //       },
    //     },
    //   },
    // ]);
    await Model.aggregate([
      {
        $match: {
          nextDate: { $lt: lt }, status: 'pending'
        },
      },
      {
        $lookup: {
          from: 'Equipment', // The related collection you want to join
          localField: 'equipment', // The field in the current collection that holds the reference to the related collection
          foreignField: '_id', // The field in the related collection (typically `_id`)
          as: 'equipmentDetails', // Name of the new array field containing the related data
        },
      },
      {
        $unwind: "$equipmentDetails"
      },
      {
        $set: {
          nextDate: {
            $add: ['$date', { $multiply: ['.$equipmentDetails.interval', 30 * 24 * 60 * 60 * 1000] }], //  set the unit of cycle to one month
          },
        },
      }
    ])

    await EquipmentModel().updateMany({ nextDate: { $lt: lt } }, [
      {
        $set: {
          nextDate: {
            $add: ['$nextDate', { $multiply: ['$interval', 30 * 24 * 60 * 60 * 1000] }], //  set the unit of cycle to one month
          },
        },
      },
    ]);

    return true;
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    console.log('Updating Notification Error: ', error);
    return false;
  }
};
module.exports = update;
