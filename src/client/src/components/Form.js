import { useState } from 'react';
import Buttons from './Buttons';
import Loading from './Loading';
import Pocket from './Pocket';
import UrlContainer from './UrlContainer';


function Form(props) {
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [badUrls, setBadUrls] = useState(null);
    const [mailError, setMailError] = useState(false);
    const [pocketList, setPocketList] = useState(null);
    const [pocketLoggedIn, setPocketLoggedIn] = [props.pocketLoggedIn, props.setPocketLoggedIn]

    // Form data
    const [userUrls, setUserUrls] = useState({0: ''});
    const [pocketUrls, setPocketUrls] = useState([]);
    const [color, setColor] = useState('light');
    const [font, setFont] = useState('sansSerif');
    const [format, setFormat] = useState('html');
    const [email, setEmail] = useState('');


    
    const allUrls = Object.values(userUrls).concat(pocketUrls);

    

   
    const handleSubmit = (e) => {    
        e.preventDefault(); // <--- This is essential    
        setLoading(true);
        setSuccess(false);
        setDeleted(false);
        setBadUrls(null);
        setEmailSent(false);
        fetch('/api/submit', {
            credentials: 'same-origin',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urls: allUrls,
                color: color,
                font: font,
                format: format,
                email: email
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
        })
        .catch(err => console.log(err));
    }

    const setRadioValues = (e) => {
        const value = e.target.value
        console.log(value);
        switch(e.target.name) {
            case 'color':
                setColor(value);
                break;
            case 'font':
                setFont(value);
                break;
            case 'format':
                setFormat(value);
                break;

            // no default
        } 
        
    }

    return ( 
        <> 
            <form onSubmit={ handleSubmit }> 
                <label>
                    URLs:
                    <UrlContainer 
                        userUrls={ userUrls }
                        setUserUrls={ setUserUrls }
                    />
                    {/*
                    <textarea 
                        id="url-input" 
                        placeholder="Enter one URL per line (including http(s) prefix)"
                        name="urls"
                        {...register('urls',{
                            pattern: {value: /^https?:\/\/.*\..+/, message: 'Please enter at least one valid URL'}
                            })
                        }
                        />
                    */}                  
                </label>
                <Pocket 
                    pocketList={ pocketList }
                    setPocketList={ setPocketList }
                    pocketLoggedIn= { pocketLoggedIn }
                    setPocketLoggedIn={ setPocketLoggedIn }
                    pocketUrls={ pocketUrls }
                    setPocketUrls={ setPocketUrls }
                />
                <div>
                    <input type="radio" value="light" name="color" onChange={ setRadioValues }/> Light mode
                    <input type="radio" value="dark" name="color" onChange={ setRadioValues }/> Dark mode
                </div>
                <div>
                    <input type="radio" value="sansSerif" name="font" onChange={ setRadioValues }/> Sans-serif
                    <input type="radio" value="serif" name="font" onChange={ setRadioValues }/> Serif
                </div>
                <div> 
                    <input type="radio" value="html" name="format" onChange={ setRadioValues }/> HTML
                    <input type="radio" value="pdf" name="format" onChange={ setRadioValues }/> PDF 
                    <input type="radio" value="epub" name="format" onChange={ setRadioValues }/> EPUB
                </div>
                    
                <div>
                    <input type="submit" value="Submit" />
                    <input 
                        type="email" 
                        placeholder="Your email (optional)" 
                        name="email" 
                        onChange={e => setEmail(e.target.value)}/>
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
                setMailError={ setMailError }
                setLoading={ setLoading }
            />        
        </>
    )
}

export default Form;