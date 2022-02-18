import { useState } from 'react';
import UrlField from './UrlField';

function UrlContainer(props) {
    const [userUrls, setUserUrls] = [props.userUrls, props.setUserUrls]
    const watchUrls = props.watchUrls;
    const watch = props.watch;
    const setValue = props.setValue;

    const insertUrlField = () => {
        let newUrls = {...userUrls};
        const urlCount = Object.keys(userUrls).length;
        newUrls[urlCount] = '';
        setUserUrls(newUrls);
    }

    const handleCheckboxChange = (e) => {
        console.log(e.target.checked);
        console.log('checkbox')
    }

    return (
        <>
            <div className="scrolling-div">
            <button type="button" onClick={ insertUrlField }>+</button>
                {
                    Object.keys(userUrls).map(key => {
                        //console.log(key);
                        return (
                            <UrlField 
                                key={ key }
                                id={ key }
                                userUrls={ userUrls }
                                setUserUrls={ setUserUrls }
                                url={ userUrls[key] }
                                register={props.register}
                                watch={ watch }
                                watchUrls={ watchUrls }
                                setValue={ setValue }
                                handleCheckboxChange= { handleCheckboxChange }
                            />
                        )
                        })
                }
            </div>
        </>
    )
};

export default UrlContainer;