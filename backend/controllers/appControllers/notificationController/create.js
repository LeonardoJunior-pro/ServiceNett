const mongoose = require('mongoose');

const Model = mongoose.model('Notification');

const create = async (equipment) => {
  try {
    const notification = [];
    notification['equipment'] = equipment['_id'];
    notification['status'] = 'pending';
    notification['date'] = equipment['nextDate'];

    // Creating a new document in the collection
    const result = await new Model(notification).save();

    // Returning successfull response
    return true;
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    console.log('Creating Notification Error: ', error);
    return false;
  }
};
module.exports = create;
