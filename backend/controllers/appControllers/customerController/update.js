const mongoose = require('mongoose');

const Model = mongoose.model('Customer');
const EquipmentModel = mongoose.model('Equipment');

const notificationController = require('@/controllers/appControllers/notificationController');

const update = async (req, res) => {
  try {
    const { contacts = [], equipments = [] } = req.body;

    let body = req.body;
    let equipment_IDs = [];
    
    body['equipmentCount'] = equipments.length;
    body['primaryContact'] = contacts.length > 0 ? contacts[0].name : "";

    for (let i = 0; i < equipments.length; i++) {
      let equipment = equipments[i];
      if (equipment._id) {
        equipment['lastDate'] = equipment.nextDate;
        await EquipmentModel.findOneAndUpdate(
          { _id: equipment._id, removed: false },
          equipment,
          {
            new: true, // return the new result instead of the old one
          }
        ).exec();
        equipment_IDs.push(equipment._id);
      } else {
        equipment['lastDate'] = equipment.nextDate;
        equipment['createdBy'] = req.params.id;
        const equipment_result = await new EquipmentModel(equipment).save();
        // await notificationController.create(equipment_result);
        equipment_IDs.push(equipment_result._id);
      }
    }

    body['equipments'] = equipment_IDs;

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
      new: true, // return the new result instead of the old one
    }).exec();

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: 'Customer updated successfully',
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
