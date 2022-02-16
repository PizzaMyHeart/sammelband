function Pocket() {

    const getPocketRequestToken = () => {
        fetch('/pocket', {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            const requestToken = data.requestToken;
            const url = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=http://localhost:3000`;
            redirectToPocket(url);
        })
        .catch(console.log);
        }

    const redirectToPocket = (url) => {
        window.location = url;
    }

    return (
        <>
            <button onClick={ getPocketRequestToken }>Pocket</button>
        </>
    )
}

export default Pocket;