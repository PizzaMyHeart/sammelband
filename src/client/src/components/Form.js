import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Form() {
    const [urls, setUrls] = useState('');

    const { register } = useForm();

    /*
    const onSubmit = e => {
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
    */
     
    // react-hook-form version
    const onSubmit = data => {
        console.log(data['urls']);
        fetch('/submit', {
            credentials: 'same-origin',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urls: data['urls'],
                colorTheme: data['color-theme']
            })
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
        <>
            <form onSubmit={ onSubmit }>
                <label>
                    URLs:
                    <textarea 
                        id="url-input" 
                        onChange={ e => {setUrls(e.target.value)} } 
                        {...register('urls')}
                        />
                </label>
                <div>
                    <input type="radio" value="dark" name="color-theme"/> Dark mode
                    <input type="radio" value="light" name="color-theme"/> Light mode
                </div>
                <div>
                    <input type="radio" value="serif" name="font"/> Serif
                    <input type="radio" value="sans-serif" name="font"/> Sans-serif
                </div>
                <div> 
                    <input type="radio" value="html" name="format"/> HTML
                    <input type="radio" value="pdf" name="format"/> PDF 
                    <input type="radio" value="epub" name="format"/> EPUB
                    <input type="radio" value="markdown" name="format"/> Markdown 
                    <input type="radio" value="txt" name="format"/> TXT 
                </div>
                    

                <input type="submit" value="Submit" />
                
            </form>
            <button onClick={ deleteFile }>Delete</button>
        </>
    )
}

export default Form;