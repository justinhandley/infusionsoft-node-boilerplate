import express from 'express'
import axios from 'axios'
import querystring from 'querystring'
import base64 from 'base-64'
import utf8 from 'utf8'
import {refreshToken} from './refresh'

const router = express.Router()
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

let data, response

router.get('/auth', (req, res) => {
  if (req.query.secret === process.env.SECRET) {
    res.redirect('https://signin.infusionsoft.com/app/oauth/authorize?client_id=' + process.env.INFUSIONSOFT_KEY + '&response_type=code&scope=full&redirect_uri=' + process.env.SITE_URL + '/infusion/call')
  } else {
    res.send('Your Secret Key Did Not Match')
  }
})

router.get('/call', async (req, res) => {
  let client = global.client
  const { code } = req.query

  await client.mutate(`
    mutation {
      updateInfusionsoft(
        id: "${process.env.GRAPHQL_RECORD}", 
        code: "${code}"
      ) {
        id
      }
    }
  `)
  .catch(e => console.log(e)) // eslint-disable-line no-console

  const authRequest = {
    client_id: process.env.INFUSIONSOFT_KEY,
    client_secret: process.env.INFUSIONSOFT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.SITE_URL + '/infusion/call',
  }

  data = querystring.stringify(authRequest)
  const contentLength = data.length

  response = await axios({
    method: 'post',
    url: 'https://api.infusionsoft.com/token',
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + base64.encode(utf8.encode(process.env.INFUSIONSOFT_KEY + ':' + process.env.INFUSIONSOFT_SECRET)),
    },
    data: data,
  })
  .catch(e => console.log(e)) // eslint-disable-line no-console

  const { access_token, token_type, expires_in, refresh_token } = response.data

  client.mutate(`
    {
      updateInfusionsoft(
        id: "${process.env.GRAPHQL_RECORD}", 
        accesstoken: "${access_token}"
        expiresin: "${expires_in}"
        refreshtoken: "${refresh_token}"
        tokentype: "${token_type}"
      ) {
        id
      }
    }
  `)
  .catch(e => console.log(e)) // eslint-disable-line no-console

  res.sendStatus(200)
})

router.get('/refresh', async (req, res) => {
  refreshToken()
  res.sendStatus(200)
})

export default router

