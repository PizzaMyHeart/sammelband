function DownloadBtn() {
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
            <button onClick={ onClick }>Download</button>
            {/*<a href='http://localhost:3001/download'>Download</a>*/}
            <button onClick={ mail }>Send to email</button>
        </>
        
    )
}

export default DownloadBtn;