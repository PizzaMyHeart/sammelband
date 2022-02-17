import { useState } from 'react';

function Pocket(props) {

    const [pocketLoggedIn, setPocketLoggedIn] = useState(props.pocketLoggedIn);
    //console.log('Pocket logged in: ', pocketLoggedIn);
    const getPocketRequestToken = () => {
        fetch('/api/pocket/request', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            const requestToken = data.requestToken;
            const url = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=http://localhost:3001/api/pocket/callback`;
            redirectToPocket(url);
        })
        .catch(console.log);
        }

    const redirectToPocket = (url) => {
        window.location = url;
    }

    const getPocketList = (e) => {
        fetch('/api/pocket/list', {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                props.setPocketList(data.list);
                console.log(data.list);
            }
            
        })
        .catch(console.log);
    }
 

    return (
        <>
            { /* 
            If logged in to pocket, show the getPocketList button but not the getPocketRequestToken button
            And vice-versa
            */}
            { pocketLoggedIn
                ? <button type="button" onClick={ getPocketList }>Get Pocket list</button>
                : <button type="button" onClick={ getPocketRequestToken }>Pocket</button>
            }
            <div className="scrolling-div">
                { props.pocketList && Object.keys(props.pocketList).map(key => {
                    return (
                    <div key={ key }>
                        <input type="checkbox" 
                        name="urls"
                        value={ props.pocketList[key]['resolved_url'] }
                        {...props.register('urls')} />
                        <label>
                            <a 
                            href={ props.pocketList[key]['resolved_url']} 
                            target="_blank" rel="noopener noreferrer">
                                { (props.pocketList[key]['given_title']) 
                                    ? (props.pocketList[key]['given_title']) 
                                    : (props.pocketList[key]['resolved_title']) }
                            </a>
                        </label>
                    </div>
                    )
                })}
            </div>
        </>
    )
}

export default Pocket;