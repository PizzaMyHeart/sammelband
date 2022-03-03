const axios = require('axios');

async function fetchFromURL(urls) {
    // Returns an object `documents` with urls as properties and the html content as 
    // the corresponding values
    console.log('fetchFromURL()');
    let documents = {};
    for (let url of urls) {
        console.log(url);
        await axios.get(url)
        .then(res => {
            //documents.push(res.data);
            documents[url] = res.data;
            console.log(Object.keys(documents));
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