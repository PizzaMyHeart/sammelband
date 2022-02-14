const axios = require('axios');

async function fetchFromURL(urls) {
    let documents = [];
    for (let url of urls) {
        console.log(url);
        await axios.get(url)
        .then(res => {
            documents.push(res.data);
        })
        .catch(err => {
            const error = `${err.errno}\n${err.code}\n${err.config.url}`
            console.log(error);
            throw error;
        });
    }
    return documents;   
}

module.exports = fetchFromURL;