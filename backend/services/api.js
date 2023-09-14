const axios = require('axios')

const api = axios.create({
    baseURL: ' https://chotu.com/wp-json',
})

const setToken = async () => {
    try {
        const res = await api.post('/jwt-auth/v1/token', {
            username: process.env['WP_USERNAME'],
            password: process.env['WP_PASSWORD']
        })
        api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
    } catch (e) {
        console.log(e)
    }

}

const getLocality = async (id) => {
    await setToken()

    try {
        const res = await api.get('/wp/v2/locality/'+id)
        return res.data

    } catch (e) {
        console.log(e)
    }

    return null
}

const getCaptain = async (captain_id) => {
    await setToken()

    try {
        const res = await api.get('/wp/v2/users/'+captain_id)
        return res.data

    } catch (e) {
        console.log(e)
    }


}

module.exports =  {api,getLocality,getCaptain}
