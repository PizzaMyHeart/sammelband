import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DownloadBtn from './DownloadBtn';
import Loading from './Loading';

function Form() {
    const [urls, setUrls] = useState('');
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: {
            'color': 'light',
            'font': 'sansSerif',
            'format': 'html'
        }
    });

    
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
        setLoading(true);
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
        .then(response => {
            if (response) {
                setSuccess(true);
                setDeleted(false);
                setLoading(false);
            };
        });
    }


    
    const deleteFile = () => {
        fetch('/delete', {
            credentials: 'same-origin',
            method: 'GET',
            mode: 'cors',
        })
        .then(response => {
            if (response) {
                setDeleted(true);
                setSuccess(false);
            };
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
                    <input type="radio" value="light" name="color" {...register('color', {required: 'Required'})}/> Light mode
                    <input type="radio" value="dark" name="color" {...register('color', {required: 'Required'})}/> Dark mode
                </div>
                <div>
                    <input type="radio" value="sansSerif" name="font" {...register('font')}/> Sans-serif
                    <input type="radio" value="serif" name="font" {...register('font')}/> Serif
                </div>
                <div> 
                    <input type="radio" value="html" name="format" {...register('format')}/> HTML
                    <input type="radio" value="pdf" name="format" {...register('format')}/> PDF 
                    <input type="radio" value="epub" name="format" {...register('format')}/> EPUB
                </div>
                    

                <input type="submit" value="Submit" />
                
            </form>
            <div>
                { success && <p>Sammelband ready</p> }
                { deleted && <p>Sammelband deleted</p>}
            </div>
            <button onClick={ deleteFile } id="deleteBtn" disabled={ deleted || !success }>Delete</button>
            <DownloadBtn disabled={!success || deleted }/>
            <div>{ loading && <Loading />}</div>
        </>
    )
}

export default Form;