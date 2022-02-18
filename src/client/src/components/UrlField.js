import { useState, useEffect } from 'react';

function UrlField(props) {
    const [url, setUrl] = useState('');
    const id = props.id
    const userUrls = props.userUrls;
    const setUserUrls = props.setUserUrls;
    const handleCheckboxChange = props.handleCheckboxChange;

    
    
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
        console.log('delete');
        const keys = Object.keys(userUrls); const values = Object.values(userUrls)
        console.log(id);
        //console.log(keys, values);
        console.log(values[id]);
        const newValues = values.filter(e => e!== values[id]);
        const newKeys = [...Array(keys.length - 1).keys()]
        console.log(newKeys);
        console.log(newValues);
        setUserUrls(Object.fromEntries(newKeys.map((key, index) => [key, newValues[index]])));
        
    }


    return (
        <div>
            <input type="url" id={ id } onChange={ e => handleChange(e) }></input>
            <button type="button" onClick={ handleDelete }>Delete</button>
        </div>
    )
};

export default UrlField;