const { text } = require('express')
const openPage = require('./openPage')
const logger = require('./logger')(__filename)
const cheerio = require('cheerio')

module.exports = async (browser, email, password, idCallback = undefined) => {
  const url = 'https://www.linkedin.com/login'
  const page = await openPage({ browser, url })
  logger.info(`logging at: ${url}`)

  await page.goto(url)
  await page.waitFor('#username')

  await page.$('#username')
    .then((emailElement) => emailElement.type(email))
  await page.$('#password')
    .then((passwordElement) => passwordElement.type(password))

  await page.$x("//button[contains(text(), 'Sign in')]")
    .then((button) => button[0].click())

  
  return page.waitFor('input[role=combobox]', {
    timeout: 15000
  })
    .then(async () => {


      console.log("Somethings wrong")
      logger.info('logged feed page selector found')
      
      const content = await page.content();
      const $ = cheerio.load(content)

      const important_user_id = $('[data-control-name="identity_profile_photo"]').parent().attr('href');
      console.log(important_user_id)
      await page.close()
      //console.log("IDCALLBACK IN LOGIN.JS", idCallback)

      if (idCallback) {
        idCallback(important_user_id);
        return;
      }

    })
    .catch(async () => {
      logger.warn('successful login element was not found')

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
      
      const emailError = await page.evaluate(() => {
        const e = document.querySelector('div[error-for=username]')
        if (!e) { return false }
        const style = window.getComputedStyle(e)
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
      })

      const passwordError = await page.evaluate(() => {
        const e = document.querySelector('div[error-for=password]')
        if (!e) { return false }
        const style = window.getComputedStyle(e)
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
      })

      const manualChallengeRequested = await page.evaluate(() => {
        const e = document.querySelector('.flow-challenge-content')
        
        if (!e) { return false }
        const style = window.getComputedStyle(e)
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
      })

      if (emailError) {
        logger.info('wrong username element found')
        return Promise.reject(new Error(`linkedin: invalid username: ${email}`))
      }

      if (passwordError) {
        logger.info('wrong password element found')
        return Promise.reject(new Error('linkedin: invalid password'))
      }

      if (page.$(manualChallengeRequested)) {
        logger.warn('manual check was required')
        console.log(await page._client.send('Network.getAllCookies'));
        return Promise.reject(new Error(`linkedin: manual check was required, verify if your login is properly working manually or report this YEET`))
      }

      logger.error('could not find any element to retrieve a proper error')
      return Promise.reject(new Error(`lmao error xd`))
    })
}
