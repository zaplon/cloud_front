import axios from 'axios'

var ezlaUrl = 'http://0.0.0.0:8090/'
if (process.env.NODE_ENV === 'production') {
  ezlaUrl = 'http://0.0.0.0:8090/'
}

var ezla = {
  url: ezlaUrl,
  getXml () {
    return axios.get(this.url + 'login')
  }
}

export default ezla
