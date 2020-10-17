// natashanakandaul98

//const Dev = require('../src2/src/models/Dev')\

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: '17984413ca676d34ca76c1617f9b3e33' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
)

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage()
  await page.goto('https://www.google.com/recaptcha/api2/demo')

  // That's it, a single line of code to solve reCAPTCHAs 🎉
  // Loop over all potential frames on that page
  for (const frame of page.mainFrame().childFrames()) {
    // Attempt to solve any potential reCAPTCHAs in those frames
    await frame.solveRecaptchas()
  }
  await page.solveRecaptchas()
  await Promise.all([
    page.waitForNavigation(),
    page.click(`#recaptcha-demo-submit`)
  ])
  await page.screenshot({ path: 'response.png', fullPage: true })
  await browser.close()
})

/*
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
console.log("connecting")

mongoose.connect("mongodb+srv://admin:admin@cluster0.buc2l.mongodb.net/database?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const DevSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  positions: {
    title: String
  },
  profile: {
    name: { type: String, required: true },
    headline: String,
    imageurl: { type: String, default: "https://static.wikia.nocookie.net/virtualyoutuber/images/e/e8/Shirakami_Fubuki_Portrait.jpg/" },
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

const Dev = mongoose.model('Dev', DevSchema)

profile = new Dev({
  user: "natashanakandaul98",
  profile: {
    "name": "skrr"
  }
});

profile.save(function (err) {
  console.log("in save callback");
  if (err) return console.log(err);
  console.log("saved")
});

*/