const mongoose = require('mongoose');

let Practice = mongoose.model('Practice', {
  statement: {
    type: String,
    minlength: 1,
    trim: true,
    required: true
  },
  evidence: [{text: String}],
  core: {type: String, required: Boolean},
  parentPractice: {type: mongoose.Schema.Types.ObjectId}
});