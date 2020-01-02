const mongoose = require('mongoose');
const nanoid = require('nanoid');

var JobSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Job position is required!'],
    index: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required!'],
  },
  companyLogo: {
    type: Buffer,
    required: [true, 'Company logo is required'],
  },
  companyHeadquarters: {
    type: String,
  },
  locationRestriction: {
    type: String,
    required: [true, 'Location restriction is required. If your job does not have any restrictions, please leave it "Worldwide"'],
  },
  tags: {
    type: [String],
    required: [true, 'Tags cannot be empty!'],
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required!'],
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
    required: [true, 'Apply link/email is required!'],
  },
  key: {
    type: String,
    default: () => nanoid(48),
  },
}, {
  timeStamps: { createdAt: true, updatedAt: true },
});

const InReviewJobs = mongoose.model('InReviewJobs', JobSchema);
const Jobs = mongoose.model('Jobs', JobSchema); 

module.exports = {
  InReviewJobs,
  Jobs,
};