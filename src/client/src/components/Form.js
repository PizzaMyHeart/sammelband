import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Form() {
    const [urls, setUrls] = useState('');

    const { register, handleSubmit, setError, formState: { errors } } = useForm();

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
                color: data['color'],
                font: data['font'],
                format: data['format']
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
            {/* Needs handleSubmit to actually send request */}
            <form onSubmit={ handleSubmit(onSubmit) }> 
                <label>
                    URLs:
                    <textarea 
                        id="url-input" 
                        //onChange={ e => {setUrls(e.target.value)} } 
                        {...register('urls',{
                            required: true,
                            pattern: {value: /^https?:\/\/.*\..+/, message: 'Please enter at least one valid URL'}
                        })}
                        />
                    { errors.urls && <p>{errors.urls.message}</p>}                    
                </label>
                <div>
                    <input type="radio" value="dark" name="color" {...register('color', {required: 'Required'})}/> Dark mode
                    <input type="radio" value="light" name="color" {...register('color', {required: 'Required'})}/> Light mode
                </div>
                <div>
                    <input type="radio" value="serif" name="font" {...register('font')}/> Serif
                    <input type="radio" value="sansSerif" name="font" {...register('font')}/> Sans-serif
                </div>
                <div> 
                    <input type="radio" value="html" name="format" {...register('format')}/> HTML
                    <input type="radio" value="pdf" name="format" {...register('format')}/> PDF 
                    <input type="radio" value="epub" name="format" {...register('format')}/> EPUB
                </div>
                    

                <input type="submit" value="Submit" />
                
            </form>
            <button onClick={ deleteFile }>Delete</button>
        </>
    )
}

export default Form;