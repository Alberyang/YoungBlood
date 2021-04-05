const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema(
    {
    experienceId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    start_date : Date,
    end_date : Date,
    position : String,
    company : String,
    description: String,
    state: String
    },
    {timestamps: true });

const exp = mongoose.model('Experience', experienceSchema);
module.exports = exp;
