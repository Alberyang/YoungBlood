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
    comments: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
		contents: String,
		},
		{timestamps: true}
	],
	like: Number,
  },
  {timestamps: true}
);

mongoose.model('Moment', momentSchema);