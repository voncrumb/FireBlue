const scrapedin = require('./scrapedin/scrapedin.js')
const configFile = require('../config.json')
const crawl = require('./crawler')

module.exports =
{
  begin: async (email, password) => {
    return new Promise((res, rej) => {

      const config = {
        email: email,
        password: password,
        hasToLog: configFile.hasToLog,
        isHeadless: configFile.isHeadless,
        puppeteerArgs: configFile.puppeteerArgs,
      }


      const idCallback = (user_id) => {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", user_id)
        //scrapedin(config)
          //.then((profileScraper) => crawl(profileScraper, ["https://www.linkedin.com/" + user_id]))
        res(user_id)
      }
      var yeet = idCallback
      console.log(yeet);
      scrapedin(config, yeet);
    })
  }

}