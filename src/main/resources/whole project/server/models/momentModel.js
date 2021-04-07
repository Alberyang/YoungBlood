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
		createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
      },
      
    ],
    like: Array,
    images: Array,
  },
  {timestamps: true}
);

mongoose.model('Moment', momentSchema);
