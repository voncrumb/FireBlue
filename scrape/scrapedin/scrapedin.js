const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const login = require('./login')
const profile = require('./profile/profile')
const company = require('./company/company')
const logger = require('./logger')(__filename)

module.exports = async ({ cookies, email, password, isHeadless, hasToLog, hasToGetContactInfo, puppeteerArgs, puppeteerAuthenticate, endpoint } = { isHeadless: true, hasToLog: false }, idCallback = undefined) => {
  puppeteer.use(StealthPlugin())
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
  if (!hasToLog) {
    logger.stopLogging()
  }
  logger.info('initializing')



  let browser; 
  /*
  const alreadyBrowser = (existingBrowser) => {
    console.log("===================================", existingBrowser)
    let browser = existingBrowser
  }

  scrapedin(config, idCallback);
  */
  if(endpoint){
    browser = await puppeteer.connect({
      browserWSEndpoint: endpoint,
    });
  }else{
    const args = Object.assign({ headless: isHeadless, args: ['--no-sandbox'] }, puppeteerArgs)
    browser = await puppeteer.launch(args)
  }


  if (cookies) {
    logger.info('using cookies, login will be bypassed')
  } else if (email && password) {
    logger.info('email and password was provided, we\'re going to login...')

    try {
      await login(browser, email, password, idCallback);
      //console.log("IDCALLBACK SCRAPEDIN.JS", idCallback)
      logger.warn('awaited login')

      if (idCallback) {
        logger.warn('returning from idcallback')

        return;
      }
    } catch (e) {
      if(!endpoint){
        await browser.close()
      }
      throw e
    }
    logger.warn('above else')
  } else {
    logger.warn('email/password and cookies wasn\'t provided, only public data will be collected')
  }

  if (idCallback != undefined) {
    console.log("SCRAPEDIN.JS CALLBACK IS UNDEFINED?")
    return;
  }

  return (url, waitMs) => url.includes('/school/') || url.includes('/company/') ? company(browser, cookies, url, waitMs, hasToGetContactInfo, puppeteerAuthenticate) :profile(browser, cookies, url, waitMs, hasToGetContactInfo, puppeteerAuthenticate)
}
