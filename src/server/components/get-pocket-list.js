const axios = require('axios');


async function getPocketRequestToken() {
    console.log('gePocketList()');
    return await axios({
        url: 'https://getpocket.com/v3/oauth/request', 
        method: 'POST',
        data: {
            consumer_key: '100903-0e604acdda56f0d5a83e7d4',
            redirect_uri: 'https://localhost:3001/pocket/callback'
        },
        transformRequest: [data => JSON.stringify(data)],
        headers: {
            'Content-Type': 'application/json;charset=UTF8',
            'X-Accept': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data.code);
        return response.data.code;
        
    })
    .catch(err => console.log(err));
}



module.exports = getPocketRequestToken
