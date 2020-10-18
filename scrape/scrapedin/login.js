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

      console.log(await page.url());

      console.log("Somethings wrong")
      logger.info('logged feed page selector found')

      const content = await page.content();
      //console.log(content)
      const $ = cheerio.load(content);

      var myRegexp = /"publicIdentifier":"([a-zA-Z-0-9]*)"/gm;
      var match = myRegexp.exec(content);
      console.log(match[1]); // abc 
      important_user_id = 'in/' + match[1]
      /*
      const important_user_id = $('[data-control-name="identity_welcome_message"]').parent().attr('href');
      console.log(important_user_id)
      await page.close()
      //console.log("IDCALLBACK IN LOGIN.JS", idCallback)
      */
      //const important_user_id = $('[data-control-name="identity_profile_photo"]').parent().attr('href');
      
      await page.close()
      if (idCallback) {
        console.log("FOUND USER", important_user_id)
        //alreadyBrowser(browser);
        idCallback(important_user_id);
        return;
      }

    })
    .catch(async () => {

      logger.warn('we in the catch lmaooooo successful login element was not found, we solving bitches')
      /*
      await page.evaluate(() => {
        async () => {

          const e = document.querySelector('.flow-challenge-content')
          if (e) {
            for (const frame of page.mainFrame().childFrames()) {
              // Attempt to solve any potential reCAPTCHAs in those frames
              await frame.solveRecaptchas()
              logger.warn('FRAME solveRecaptchas xd')
            }
            await page.solveRecaptchas()
            await Promise.all([
              page.waitForNavigation()
            ])
          }
        }
      })
      try {
        for (const frame of page.mainFrame().childFrames()) {
            // Attempt to solve any potential reCAPTCHAs in those frames
            await frame.solveRecaptchas()
            logger.warn('FRAME solveRecaptchas xd')
          }
          await page.solveRecaptchas()
          logger.warn('solveRecaptchas xd')
          await Promise.all([
            //page.waitForNavigation(),
            //page.click(`#recaptcha-checkbox`)
          ])      
      } catch (error) {
          logger.warn('error xd', error)
          throw (error)
      }*/

      const emailError = await page.evaluate(() => {
        const e = document.querySelector('div[error-for=username]')
        if (!e) { return false }
        const style = window.getComputedStyle(e)
        logger.warn('email error')
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
      })

      const passwordError = await page.evaluate(() => {
        const e = document.querySelector('div[error-for=password]')
        if (!e) { return false }
        const style = window.getComputedStyle(e)
        logger.warn('password error')

        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
      })

      const manualChallengeRequested = await page.evaluate(() => {
        const e = document.querySelector('.flow-challenge-content')
        if (!e) { return false }
        const style = window.getComputedStyle(e)
        logger.warn('challenge error')
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
        return Promise.reject(new Error(`linkedin: manual check was required, verify if your login is properly working manually or report this YEET`))
      }

      logger.error('could not find any element to retrieve a proper error')
      return Promise.reject(new Error(`lmao error xd`))
    })
}
