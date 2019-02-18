const mongoose = require('mongoose');

let Initiative = mongoose.model('Initiative', {
  companyName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  initiativeName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  appraisalScopeDescription: {
    type: String,
    trim: true
  },
  countProjectsScope: {
    type: Number
  },
  countServicesScope: {
    type: Number
  },
  targetMaturityLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  active: {
    type: Boolean,
    default: true
  },
  lastUpdate: {
    type: Number,
    default: null
  }
});

module.exports = {Initiative};