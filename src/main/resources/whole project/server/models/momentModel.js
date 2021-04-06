const mongoose = require('mongoose');

const {Schema} = mongoose;

const momentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
    contents: String,
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: String,
        contents: String,
      },
      {timestamps: true},
    ],
    like: Number,
    images: Array,
  },
  {timestamps: true}
);

mongoose.model('Moment', momentSchema);
