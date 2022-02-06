import { useState } from 'react';

function Form() {
    const [urls, setUrls] = useState('');

    const handleSubmit = e => {
        let payload = {
            urls: urls,
            test: 'test'
        }
        console.log(urls);
        e.preventDefault();
        fetch('/submit', {
            credentials: 'same-origin',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    }

    const deleteFile = () => {
        fetch('/delete', {
            credentials: 'same-origin',
            method: 'GET',
            mode: 'cors',
        })
    }

    return ( 
        <form onSubmit={ handleSubmit }>
            <label>
                URLs:
                <textarea 
                    id="url-input" 
                    onChange={ e => {setUrls(e.target.value)} } 
                    required
                    pattern="^http.*"
                    />
            </label>
            <div>
                <input type="radio" value="dark" name="color-theme"/> Dark mode
                <input type="radio" value="light" name="color-theme"/> Light mode
            </div>
            <div> 
                <input type="radio" value="html" name="format"/> HTML
                <input type="radio" value="pdf" name="format"/> PDF 
                <input type="radio" value="epub" name="format"/> EPUB
                <input type="radio" value="markdown" name="format"/> Markdown 
                <input type="radio" value="txt" name="format"/> TXT 
            </div>
                

            <input type="submit" value="Submit" />
            <button onClick={ deleteFile }>Delete</button>
        </form>
    )
}

export default Form;