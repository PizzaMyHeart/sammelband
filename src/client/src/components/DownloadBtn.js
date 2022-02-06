function DownloadBtn() {
    const onClick = () => {
        fetch('http://localhost:3001/download', {
            method: 'GET',
            mode: 'cors'
        })
    }
    return (
        <>
            <button onClick={ onClick }>Download HTML</button>
            <a href="http://localhost:3001/download" download>Download HTML</a>
        </>
        
    )
}

export default DownloadBtn;