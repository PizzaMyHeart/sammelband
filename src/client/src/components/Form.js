import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Buttons from './Buttons';
import Loading from './Loading';


function Form() {
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [badUrls, setBadUrls] = useState(null);
    const [mailError, setMailError] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            'color': 'light',
            'font': 'sansSerif',
            'format': 'html'
        }
    });
     
    // react-hook-form version
    const onSubmit = data => {
        console.log(data['urls']);
        setLoading(true);
        setSuccess(false);
        setDeleted(false);
        setBadUrls(null);
        setEmailSent(false);
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
                format: data['format'],
                email: data['email']
            })
        })
        .then(response => {
            setDeleted(false);
            if (response.ok) {
                setSuccess(true);
                setLoading(false);
                setSubmitError(null);
                return response.json()
            } else {
                setLoading(false);
                console.log('Unsuccesful submit');
                response.text().then(text => setSubmitError(text));
            }
        })
        .then(data => {
            if (data.malformedUrl) {
                setBadUrls(data.malformedUrl);
            }
        });
    }

    return ( 
        <> 
            {/* Needs handleSubmit to actually send request */}
            <form onSubmit={ handleSubmit(onSubmit) }> 
                <label>
                    URLs:
                    <textarea 
                        id="url-input" 
                        placeholder="Enter one URL per line (including http(s) prefix)"
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
                    
                <div>
                    <input type="submit" value="Submit" />
                    <input type="email" placeholder="Your email (optional)" name="email" {...register('email')}/>
                </div>
                

                <div id="messages">
                    <div>{ loading && <Loading />}</div>
                    <div id="error-messages">
                        { submitError && <p>{ submitError }</p>}
                        { badUrls && <p>Invalid URLs not processed: { badUrls }</p> }
                        { mailError && <p>{ mailError }</p>}
                    </div>
                    <div>
                        { success && <p>Sammelband ready</p> }
                        { deleted && <p className="fade-out">Sammelband deleted</p>}
                        { emailSent && <p className="fade-out">Sammelband sent to your email</p>}
                    </div>
                </div>
                
            </form>

            <Buttons
                success={ success } 
                setSuccess={ setSuccess }
                deleted={ deleted }
                setDeleted={ setDeleted }
                emailSent={ emailSent }
                setEmailSent={ setEmailSent }
                handleSubmit={ handleSubmit }
                setMailError={ setMailError }
                setLoading={ setLoading }
            />        
        </>
    )
}

export default Form;