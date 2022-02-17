function Pocket(props) {
    const getPocketRequestToken = () => {
        fetch('/pocket/request', {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            const requestToken = data.requestToken;
            const url = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=http://localhost:3001/pocket/callback`;
            redirectToPocket(url);
        })
        .catch(console.log);
        }

    const redirectToPocket = (url) => {
        window.location = url;
    }

    const getPocketList = () => {
        fetch('/pocket/list', {
            method: 'GET',
            credentials: 'same-origin',
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
            <button onClick={ getPocketRequestToken }>Pocket</button>
            <button onClick={ getPocketList }>Get Pocket list</button>
            <div id="pocket-list-container">
                <div>
                    <input type="checkbox"></input>
                    <label>Article title - URL</label>
                </div>
                { props.pocketList && Object.keys(props.pocketList).map(key => {
                    return (
                    <div>
                        <input type="checkbox"></input>
                        <label>{props.pocketList[key]['given_title']}</label>
                    </div>
                    )
                })}
            </div>
        </>
    )
}

export default Pocket;