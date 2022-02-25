const axios = require('axios');


require('dotenv').config();
const consumer_key = process.env.POCKET_CONSUMER_KEY;

async function getPocketToken(tokenType, requestToken /* optional */) {
    console.log('getPocketToken()');
    let url = ''; let data = {};
    const code = requestToken;
    if (tokenType =='request') {
        console.log('Getting request token');
        url = 'https://getpocket.com/v3/oauth/request';
        data = {
            consumer_key: consumer_key,
            redirect_uri: `${process.env.SERVER_URL}/api/pocket/callback`
        }
    } else if (tokenType == 'access') {
        url = 'https://getpocket.com/v3/oauth/authorize';
        data = {
            consumer_key: consumer_key,
            code: code
        }
    }
    return await axios({
        url: url, 
        method: 'POST',
        data: data,
        transformRequest: [data => JSON.stringify(data)],
        headers: {
            'Content-Type': 'application/json;charset=UTF8',
            'X-Accept': 'application/json'
        }
    })
    .then(response => {
        //console.log(response);
        return response;
    })
    .catch(err => console.log(err));
}

// Rewrite this so uses the above function with options
// Pocket's retrieve API docs are wrong -- different request schema than the auth ones
// when in fact they should be the same!!
async function getPocketList(accessToken) {
    console.log('getpocketlist()');
    console.log('Access token: ', accessToken)
    return await axios({
        url: 'https://getpocket.com/v3/get',
        method: 'POST',
        data: {
            consumer_key: consumer_key,
            access_token: accessToken
        },
        transformRequest: [data => JSON.stringify(data)],
        headers: {
            'Content-Type': 'application/json;charset=UTF8',
            'X-Accept': 'application/json'
        }
        
    })
    .then(response => {
        //console.log(response);
        return response;
    })
    .catch(err => console.log(err));
}

module.exports = {getPocketToken, getPocketList}
