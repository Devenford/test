import axios from 'axios'

const baseUrl = 'http://localhost:3002/api/notes'

const getAll = () => {
    const promise = axios.get(baseUrl)
    return promise.then(response => response.data)
}

const create = newObject => {
    const promise = axios.post(baseUrl, newObject)
    return promise.then(response => response.data)

}

const update = (id, newObject) => {
    const promise = axios.put(`${baseUrl}/${id}`, newObject)
    return promise.then(response => response.data)
}

export default {getAll, create, update}