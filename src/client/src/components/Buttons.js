import downloadIcon from '../icons/download.svg';
import mailIcon from '../icons/mail.svg';
import attachmentIcon from '../icons/paperclip.svg';
import trashIcon from '../icons/trash-2.svg'

function Buttons(props) {
    const download = () => {

        window.location = `${process.env.REACT_APP_API_DOMAIN}/api/download`
        /*
        fetch('/download', {
            credentials: 'include',
            method: 'GET',
            mode: 'cors'
        })
        */
    }

    const deleteFile = () => {
        fetch('/api/delete', {
            credentials: 'include',
            method: 'GET',
            mode: 'cors',
        })
        .then(response => {
            if (response) {
                props.setDeleted(true);
                props.setSuccess(false);
            };
        });
    }

    const mail = (e) => {
        props.setLoading(true);
        e.preventDefault();
        console.log(e.currentTarget.value);
        fetch(`/api/mail?type=${e.currentTarget.value}`, {
            credentials: 'include',
            method: 'GET',
            mode: 'cors'
        })
        .then(response => {
            props.setLoading(false);
            if (response.ok) {
                console.log('email sent');
                props.setEmailSent(true);
            } else {
                response.text().then(text => props.setMailError(text));
            }
        })
    }
    return (
        <div className="flex-container">
            <button className="btn" onClick={ deleteFile } id="deleteBtn" disabled={ props.deleted || !props.success }>
                <img src={ trashIcon } alt="Trash can icon"/>
            </button>
            <button className="btn" onClick={ download } disabled={ !props.success }>
                <img src={ downloadIcon } alt="Download icon"/>
            </button>
            <button className="btn" onClick={ mail } value="body" disabled={ !props.success }>
                <img src={ mailIcon } alt="Mail icon"/>
            </button>
            <button className="btn" onClick={ mail } value="attachment" disabled={ !props.success }>
                <img src={ attachmentIcon } alt="Attachment icon"/>
            </button>
        </div>
        
    )
}

export default Buttons;