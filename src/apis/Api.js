import axios from 'axios'
export const BASE_URL = "http://localhost:8000/api"
export const WS_URL = "ws://localhost:8000"
axios.defaults.withCredentials = true

const endPointsList = {
    login:"/login",
    signup:"/signup",
    verifyCode:"/verifyCode/",
    getUsers:"/getUsers/",
    updateProfile:"/updateProfile/",
    getFriends:"/getFriends/",
    requestFriend:"/requestFriend/",
    acceptFriend:"/acceptFriend/",
    pendingFriends:"/pendingFriends/",
    defaultProfileImages:"/defaultProfileImages/",
    getFriendsWithChat:"/getFriendsWithChat/",
    getFrndChats:"/getFrndChats/",
    deleteRequest:"/deleteRequest/",
    userInfo:"/userInfo"
}

export const postReq = async (url, formData) => {
    return axios.post(`${BASE_URL}${endPointsList[url]}`, formData)
    .then(response => response.data)
    .catch(error => {
        throw error; // Throw any errors for the caller to handle
    });
};
export const getReq = async (url, param = '') => {
    
    return axios.get(`${BASE_URL}${endPointsList[url]}${param}`)
    .then(response => response.data)
    .catch(error => {
        throw error; // Throw any errors for the caller to handle
    });
};