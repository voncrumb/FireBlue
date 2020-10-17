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



      logger.info('logged feed page selector found')
      
      const content = await page.content();
      const $ = cheerio.load(content)

      const important_user_id = $('[data-control-name="identity_profile_photo"]').parent().attr('href');

      await page.close()
      if (idCallback) {
        idCallback(important_user_id);
        return;
      }

    })
    .catch(async () => {
      logger.warn('successful login element was not found')
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
        return Promise.reject(new Error(`linkedin: manual check was required, verify if your login is properly working manually or report this YEET`))
      }

      logger.error('could not find any element to retrieve a proper error')
      return Promise.reject(new Error(`lmao error xd`))
    })
}
