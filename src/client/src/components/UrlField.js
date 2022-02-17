import { useState, useEffect } from 'react';

function UrlField(props) {
    const [url, setUrl] = useState('');
    const watchUrls = props.watchUrls;
    const watch = props.watch;
    const setValue = props.setValue;
    
    useEffect(() => {
        //console.log(watchUrls);
    })

    const handleChange = (e) => {
        //console.log(e.target.value);
        //console.log(e.target.id)
        setUrl(e.target.value);
        let newUrls = {...props.userUrls};
        //console.log(newUrls[e.target.id]);
        newUrls[e.target.id] = e.target.value;
        setValue('urls', Object.values(newUrls));
        //console.log(newUrls);
        props.setUserUrls(newUrls);
    }

    return (
        <div>
            <input type="checkbox" 
                        name="urls"
                        value={ props.url }
                        {...props.register('urls', {onChange: (e) => console.log(e.target.value)})} />

            <input type="url" id={ props.id } onChange={ e => handleChange(e) }></input>
        </div>
    )
};

export default UrlField;