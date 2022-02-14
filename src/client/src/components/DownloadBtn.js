import downloadIcon from '../icons/download.svg';
import mailIcon from '../icons/mail.svg'
import attachmentIcon from '../icons/paperclip.svg'

function DownloadBtn(props) {
    let disabled = props.disabled;
    console.log(disabled);
    const onClick = () => {

        window.location = 'http://localhost:3001/download'
        /*
        fetch('/download', {
            method: 'GET',
            mode: 'cors'
        })
        */
    }

    const mail = () => {
        fetch('/mail', {
            credentials: 'same-origin',
            method: 'GET',
            mode: 'cors'
        })
    }
    return (
        <>
            <button class="btn" onClick={ onClick } disabled={ disabled }>
                <img src={ downloadIcon } alt="Download icon"/>
            </button>
            {/*<a href='http://localhost:3001/download'>Download</a>*/}
            <button class="btn" onClick={ mail }>
                <img src={ mailIcon } alt="Mail icon"/>
            </button>
            <button class="btn">
                <img src={ attachmentIcon } alt="Attachment icon"/>
            </button>
        </>
        
    )
}

export default DownloadBtn;