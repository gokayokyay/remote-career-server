const mongoose = require('mongoose');
const nanoid = require('nanoid');

var JobSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Job position is required!\n'],
    index: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required!\n'],
  },
  companyLogo: {
    type: Buffer,
    required: [true, 'Company logo is required\n'],
  },
  companyHeadquarters: {
    type: String,
  },
  locationRestriction: {
    type: String,
    required: [true, 'Location restriction is required. If your job does not have any restrictions, please leave it "Worldwide"\n'],
  },
  tags: {
    type: [String],
    required: [true, 'Tags cannot be empty!\n'],
    index: true,
    validate: {
      validator: function (v) {
        return v.length > 0 && v.length < 4;
      },
      message: 'Minimum one, maximum three tags must be provided.\n',
    },
  },
  description: {
    type: String,
    required: [true, 'Job description is required!\n'],
    index: true,
  },
  responsibilities: {
    type: String,
  },
  requirements: {
    type: String,
    index: true,
  },
  niceToHave: {
    type: String,
  },
  applyLink: {
    type: String,
    required: [true, 'Apply link/email is required!\n'],
    validate: {
      validator: function (v) {
        return v.includes('@') || v.includes('http');
      },
      message: 'You must provide an email or a link.\n',
    },
  },
  key: {
    type: String,
    default: () => nanoid(128),
    unique: true,
  },
}, {
  timestamps: true,
});

const InReviewJobs = mongoose.model('InReviewJobs', JobSchema);
const Jobs = mongoose.model('Jobs', JobSchema); 

module.exports = {
  InReviewJobs,
  Jobs,
};