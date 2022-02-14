const axios = require('axios');

async function fetchFromURL(urls) {
    let documents = [];
    for (let url of urls) {
        console.log(url);
        await axios.get(url)
        .then(res => {
            documents.push(res.data);
        })
        .catch(err => console.log(err));
    }
    return documents;   
}

module.exports = fetchFromURL;