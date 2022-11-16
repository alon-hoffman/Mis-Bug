import { userService } from "../services/user.service.js"

const API_URL = 'http://localhost:3000/api'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'


export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query(filterBy) {
  console.log("query")
  return axios.get(`${API_URL}/bug`, { params: filterBy })
    .then(({ data }) => data

    )
}

function getById(bugId) {
  return axios.get(`${API_URL}/bug/${bugId}`)
    .then(({ data }) => data)
}

function remove(bug) {
  const user = userService.getLoggedInUser()
  console.log(bug)
  if (bug.maker._id !== user._id) return Promise.reject()
  return axios.delete(`${API_URL}/bug/${bugId}`)
    .then(({ data }) => data)
}

function save(bug) {
  const user = userService.getLoggedInUser()
  debugger
  if (!bug._id) {
    bug.maker = user
    return axios.post(`${API_URL}/bug`, bug) // create bug
  }
  if (bug.maker._id !== user._id) return Promise.reject()
  return axios.put(`${API_URL}/bug/${bug._id}`, bug)
  // update bug
}


function getEmptyBug() {
  return {
    _id: '',
    title: '',
    description: '',
    severity: 1,
    createdAt: 0
  }
}
