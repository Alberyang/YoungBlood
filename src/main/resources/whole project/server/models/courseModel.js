const mongoose = require('mongoose');
const {Schema} = mongoose;

const courseSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    code: String,
    name: String,
    description: String,
    state:{
        type: String,
        enum : ['Finished','OnGoing','Planned'],
        default: 'OnGoing'
    },
    related_skills: Array,
    grades: {
    	type: Number,
    	min: 0,
    	max: 100
    },
    link: String,
    year: Number,
    sem : {
    	type: String,
    	enum: ['Winter','Summer','Sem1','Sem2'],
    	default: 'Sem1'
    },
    core: Boolean,
    score: {
    	type: Number,
    	enum : [1,2,3,4],
    	default: 1
    }
  },
  {timestamps: true}
);

const course = mongoose.model('course', courseSchema);
module.exports = course;