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
            <button class="btn" onClick={ onClick } disabled={ disabled }>Download</button>
            {/*<a href='http://localhost:3001/download'>Download</a>*/}
            <button class="btn" onClick={ mail }>Send to email</button>
        </>
        
    )
}

export default DownloadBtn;