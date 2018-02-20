import axios from 'axios/index'

export const getToken = async () => {
  const tokenobject = await global.client.query(`
      query {
      Infusionsoft(
        id: "${process.env.GRAPHQL_RECORD}"
      ) {
        accesstoken
      }
    }
  `)
  return tokenobject.Infusionsoft.accesstoken
}

export const getHeaders = () => {
  return {
    'Accept': 'application/json, */*',
    'Authorization': 'Basic ' + global.token,
    'content-type': 'application/json',
  }
}

export const addUpdateContact = async (contact) => {
  let data, response
  data = JSON.stringify(contact)
  response = await axios({
    method: 'put',
    headers: global.headers,
    url: 'https://api.infusionsoft.com/crm/rest/v1/contacts?access_token=' + global.token,
    data: data
  })
  .catch(e => console.log('This is E', e)) // eslint-disable-line no-console

  console.log('Added or Updated Contact Id:', response.data.id) // eslint-disable-line no-console
  return response.data.id
}

export const updateContact = async (contact, infusionsoftId) => {
  let data, response
  data = JSON.stringify(contact)
  response = await axios({
    method: 'patch',
    headers: global.headers,
    url: 'https://api.infusionsoft.com/crm/rest/v1/contacts/' + infusionsoftId + '?access_token=' + global.token,
    data: data
  })
  .catch(e => console.log('Error', e)) // eslint-disable-line no-console

  console.log('Updated Contact Id:', infusionsoftId) // eslint-disable-line no-console
  return response
}

export const updateTags = async (tagstoapply, infusionsoftId) => {
  let tagstring, tagobject, response, data
  console.log('Updating Tags', tagstoapply) // eslint-disable-line no-console
  tagstring=tagstoapply.toString()
  tagobject = {
    'tagIds': tagstoapply
  }
  data = JSON.stringify(tagobject)
  response = await axios({
    method: 'post',
    headers: global.headers,
    url: `https://api.infusionsoft.com/crm/rest/v1/contacts/${infusionsoftId}/tags?access_token=${global.token}&ids=${tagstring}`,
    data: data
  })
  .catch(e => console.log('This is E', e)) // eslint-disable-line no-console

  return response
}

export const removeTags = async (tagstoremove, infusionsoftId) => {
  let tagstring, tagobject, data, response
  console.log('Removing Tags', tagstoremove, infusionsoftId) // eslint-disable-line no-console
  tagstring=tagstoremove.toString()
  tagobject = {
    'tagIds': tagstoremove
  }
  data = JSON.stringify(tagobject)
  response = await axios({
    method: 'delete',
    headers: global.headers,
    url: `https://api.infusionsoft.com/crm/rest/v1/contacts/${infusionsoftId}/tags?access_token=${global.token}&ids=${tagstring}`,
    data: data
  })
  .catch(e => console.log('This is E', e)) // eslint-disable-line no-console

  return response
}
