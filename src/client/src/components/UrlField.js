import { useState, useEffect } from 'react';
import trashIcon from '../icons/trash-2.svg'

function UrlField(props) {
    const [url, setUrl] = useState('');
    const id = props.id
    const userUrls = props.userUrls;
    const setUserUrls = props.setUserUrls;
    const handleCheckboxChange = props.handleCheckboxChange;
    const [formErrors, setFormErrors] = [props.formErrors, props.setFormErrors];
    
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
        //console.log(newUrls);
        props.setUserUrls(newUrls);
    }

    const handleDelete = () => {
        const keys = Object.keys(userUrls); const values = Object.values(userUrls)
        console.log(id);
        //console.log(keys, values);
        console.log(`Delete ${values[id]}`);
        
        const newValues = values.filter(e => e!== values[id]);
        const newKeys = [...Array(keys.length - 1).keys()]
        console.log(newKeys);
        console.log(newValues);
        setUserUrls(Object.fromEntries(newKeys.map((key, index) => [key, newValues[index]])));
        
    }

    const validateUrl = (e) => {
        const url = e.target.value;
        const id = e.target.id;
        console.log(id);
        console.log(formErrors.url);
        const urlIsValid = RegExp(/^https?:\/\/.*\...+/).test(url);
        if (!urlIsValid) {
            //setFormErrors({...formErrors, url: 'Please enter a valid URL (prefixed with "http(s)"'});
            if (!formErrors.url.includes(id)) {
                setFormErrors({...formErrors, url: [...formErrors.url, id]});
            }
            
            //setFormErrors({...formErrors, url : [...url, id] });
            
        } else {
            setFormErrors({...formErrors, url: []});
        }

    }


    return (
        <div>
            <input 
                type="url" 
                id={ id } 
                onChange={ e => handleChange(e) } 
                onBlur={ e => validateUrl(e) }
                value={ userUrls[id] } // This will keep the value of the existing url after it
                />
            <button type="button" onClick={ handleDelete }>
                <img src={ trashIcon } alt="Delete icon"/>
            </button>
            { (formErrors.url.length > 0 && formErrors.url.includes(id)) && <p>Please enter a valid URL.</p> }
        </div>
    )
};

export default UrlField;