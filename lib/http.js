// lib.http.js

const axios = require("axios")

axios.interceptors.response.use(res => {
    return res.data;
})

const getRepoList = async () => {
    return axios.get('https://api.github.com/users/kitions/repos')
}

const getTagList = async (repo) => {
    return axios.get(`https://api.github.com/repos/kitions/${repo}/tags`)
}

module.exports = {
    getRepoList,
    getTagList
}