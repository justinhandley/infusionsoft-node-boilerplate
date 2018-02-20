import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import InfusionAuth from './components/infusionauth'
import Process from './components/process-file'
import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import api from 'infusionsoft-javascript-api'
import {getHeaders, getToken} from './helpers/infusionsoft'

const app = express()
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

app.use(bodyParser.json())
app.use('/infusion', InfusionAuth)
app.use('/process', Process)

const port = process.env.PORT || 8080

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error) // eslint-disable-line no-console
})

http
.createServer(app)
.listen(port, async function () {

  // Configure Lokka 'client' as global variable
  const lokkaheaders = {'Authorization': 'Bearer ' + process.env.GRAPHQL_AUTH,}
  global.client = new Lokka({transport: new Transport(process.env.GRAPHQL, {lokkaheaders}),})
  // Configure Infusionsoft REST api 'token' and 'headers' as globals
  global.token = await getToken()
  global.headers = getHeaders()
  // Configure Infusionsoft XML API as global 'infusionsoft'
  global.infusionsoft = new api.DataContext(process.env.INFUSIONSOFT_APP, process.env.INFUSIONSOFT_APP_SECRET)

  console.log('Updated : Server listening at port %d', port) // eslint-disable-line no-console
})
