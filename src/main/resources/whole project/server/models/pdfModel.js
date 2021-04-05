const mongoose = require('mongoose');

const {Schema} = mongoose;

const pdfSchema = new Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    originalName: String,
    filename: String,
    date: String,
    title: String,
    isResume: Boolean,
  },
  {timestamps: true}
);

const PDF = mongoose.model('Pdf', pdfSchema);
module.exports = PDF;
