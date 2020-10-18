const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  positions: [{
    title: String,
    companyName: String
  }],
  profile: {
    name: { type: String, required: true },
    headline: String,
    imageurl: { type: String, default: "https://qph.fs.quoracdn.net/main-qimg-cf89e8e6daa9dabc8174c303e4d53d3a" },
    location: String,
    summary: String
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
}, {
  timestamps: true,
});

module.exports = model('Dev', DevSchema);