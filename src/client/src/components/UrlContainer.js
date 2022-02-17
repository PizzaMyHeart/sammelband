import { useState } from 'react';
import UrlField from './UrlField';

function UrlContainer(props) {
    const [userUrls, setUserUrls] = useState({1: 'https://example.com', 2: 'https://tor.com'});


    return (
        <>
            <div className="scrolling-div">

                {
                    Object.keys(userUrls).map(key => {
                        console.log(key);
                        return (
                            <UrlField 
                                key={ key }
                                id={ key }
                                userUrls={ userUrls }
                                setUserUrls={ setUserUrls }
                                url={ userUrls[key] }
                                register={props.register}
                            />
                        )
                        })
                }
            </div>
        </>
    )
};

export default UrlContainer;