import { useState } from 'react';

function Urls() {
    const [urls, setUrls] = useState('');

    const handleSubmit = e => {
        let payload = {
            urls: urls,
            test: 'test'
        }
        console.log(urls);
        e.preventDefault();
        fetch('http://localhost:3001/article_urls/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    }

    return ( 
        <form onSubmit={ handleSubmit }>
            <label>
                URLs:
                <textarea name="urls" onChange={ e => {setUrls(e.target.value)} }/>
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}

export default Urls;