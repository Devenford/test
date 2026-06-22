import axios from 'axios'
const baseUrl = '/api/notes'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const promise = axios.get(baseUrl)
  return promise.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const promise = axios.put(`${baseUrl}/${id}`, newObject)
  return promise.then(response => response.data)
}

export default { getAll, create, update, setToken }