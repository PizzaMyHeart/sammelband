function DownloadBtn() {
    const onClick = () => {

        window.location = 'http://192.168.1.63:3001/download'
        /*
        fetch('/download', {
            method: 'GET',
            mode: 'cors'
        })
        */
    }
    return (
        <>
            <button onClick={ onClick }>Download</button>
            <a href='http://192.168.1.63:3001/download'>Download</a>
            <button>Send to email (coming soon)</button>
        </>
        
    )
}

export default DownloadBtn;