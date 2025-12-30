const mongoose = require('mongoose');

const testLocal = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/test', { serverSelectionTimeoutMS: 2000 });
    console.log('Local MongoDB is running!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log('Local MongoDB not reachable.');
    process.exit(1);
  }
};

testLocal();
