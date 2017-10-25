export default url => {
    return fetch(url).then(data => data.text()).catch(e => {throw e})
}