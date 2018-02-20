import express from 'express'
import {addUpdateContact, updateTags, removeTags} from '../helpers/infusionsoft'

const router = express.Router()
if (process.env.NODE_ENV !== 'production') require('dotenv').config()


router.get('/', async (req, res) => {

  const contact = {
    'duplicate_option': 'Email',
    'email_addresses': [
      {
        'email': 'test@apitest.com',
        'field': 'EMAIL1'
      }
    ],
    'family_name': 'User1',
    'given_name': 'Test',
    'opt_in_reason': 'API Test',
  }

  const contactId = await addUpdateContact(contact)

  // To add tags, uncomment the code below, and put a comma separated list of tag ids into []
  // const tagstoupdate = []
  // await updateTags(tagstoupdate, contactId)
  // .then(res => console.log(res.data)) // eslint-disable-line no-console

  // To remove tags, uncomment the code below, and put a comma separated list of tag ids into []
  // const tagstoremove = []
  // await removeTags(tagstoremove, contactId)
  // .then(res => console.log(res.data)) // eslint-disable-line no-console

  res.send('Finished Processing')

})

export default router
