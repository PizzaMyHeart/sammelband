import { useState } from 'react';

function UrlField(props) {
    const [url, setUrl] = useState('');
   

    const handleChange = (e) => {
        console.log(e.target.value);
        console.log(e.target.id)
        setUrl(e.target.value);
        let newUrls = {...props.userUrls};
        console.log(newUrls[e.target.id]);
        newUrls[e.target.id] = e.target.value;
        console.log(newUrls);
        props.setUserUrls(newUrls);
    }

    return (
        <div>
            <input type="checkbox" 
                        name="urls"
                        value={ props.url }
                        {...props.register('urls')} />

            <input type="url" id={ props.id } onChange={ e => handleChange(e) }></input>    
            <button type="button" onClick={props.insertUrlFields}>Insert URL field</button>
        </div>
    )
};

export default UrlField;