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
    imageurl: { type: String, default: "https://static.wikia.nocookie.net/virtualyoutuber/images/e/e8/Shirakami_Fubuki_Portrait.jpg" },
    location: String,
    summary: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dev',
  }],
}, {
  timestamps: true,
});

module.exports = model('Dev', DevSchema);