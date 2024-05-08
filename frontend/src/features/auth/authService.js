import axios from 'axios'
// REACT_APP_API_URL env variable for Production, otherwise for Development set up a proxy in package.json for development
const apiUrl = process.env.REACT_APP_API_URL || '';

const API_URL = `${apiUrl}/api/users/`

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  logout,
  login,
}

export default authService
