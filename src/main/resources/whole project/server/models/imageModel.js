const mongoose = require('mongoose');

const {Schema} = mongoose;

const imageSchema = new Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    filename: String,
    originalName: String,
    type: String,
    caption: String,
  },
  {timestamps: true}
);

mongoose.model('Image', imageSchema);
