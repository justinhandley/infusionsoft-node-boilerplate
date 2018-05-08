const axios = require('axios/index');
const querystring = require('querystring');
const Lokka = require('lokka');
const Transport = require('lokka-transport-http');
const base64 = require('base-64');
const utf8 = require('utf8');

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const lokkaheaders = {
  'Authorization': 'Bearer ' + process.env.GRAPHQL_AUTH,
}

const client = new Lokka.default({
  transport: new Transport.default(process.env.GRAPHQL, { lokkaheaders }),
})

let data, response

module.exports = {

  refreshToken: async () => {

    console.log('Starting Infusionsoft Token Refresh') // eslint-disable-line no-console

    response = await client.query(`
      query {
      Infusionsoft(
        id: "${process.env.GRAPHQL_RECORD}"
      ) {
        refreshtoken
      }
    }
  `)
    .catch(e => console.log(e)) // eslint-disable-line no-console

    const refreshRequest = {
      grant_type: 'refresh_token',
      refresh_token: response.Infusionsoft.refreshtoken,
    }

    data = querystring.stringify(refreshRequest)
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

    const {access_token, token_type, expires_in, refresh_token} = response.data

    await client.mutate(`
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
    .then(() => console.log('Token Refreshed')) // eslint-disable-line no-console
    .catch(e => console.log(e)) // eslint-disable-line no-console

  }
}
