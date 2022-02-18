import { useState, useEffect, useRef } from 'react';

function UrlField(props) {
    const [url, setUrl] = useState('');
    const id = props.id
    const userUrls = props.userUrls;
    const setUserUrls = props.setUserUrls;
    const handleCheckboxChange = props.handleCheckboxChange;

    const inputRef = useRef(null);
    
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


    return (
        <div>
            <input 
                type="url" 
                ref={ inputRef } 
                id={ id } 
                onChange={ e => handleChange(e) } 
                value={ userUrls[id] } // This will keep the value of the existing url after it
                />
            <button type="button" onClick={ handleDelete }>Delete</button>
        </div>
    )
};

export default UrlField;