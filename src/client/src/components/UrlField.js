import { useState, useEffect } from 'react';

function UrlField(props) {
    const [url, setUrl] = useState('');
    const watchUrls = props.watchUrls;
    const watch = props.watch;
    const setValue = props.setValue;
    const handleCheckboxChange = props.handleCheckboxChange;

    
    
    useEffect(() => {
        //console.log(watchUrls);
    })

    const handleChange = (e) => {
        //console.log(e.target.value);
        //console.log(e.target.id)
        setUrl(e.target.value);
        let newUrls = {...props.userUrls};
        console.log(watchUrls);
        //console.log(newUrls[e.target.id]);
        newUrls[e.target.id] = e.target.value;
        //setValue('urls', Object.values(newUrls));
        //setValue('urls', watchUrls);
        setValue('urls', watchUrls)
        //console.log(newUrls);
        props.setUserUrls(newUrls);
    }



    return (
        <div>
            <input type="checkbox" 
                        name="urls"
                        value={ props.url }
                        onChange={ e => handleCheckboxChange(e) }
                        {...props.register('urls')} />

            <input type="url" id={ props.id } onChange={ e => handleChange(e) }></input>
        </div>
    )
};

export default UrlField;