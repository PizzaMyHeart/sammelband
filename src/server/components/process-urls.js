function processUrls(urlArray) {
    let urls = urlArray.split('\n');
    const originalUrls = [...urls];
    let cleanUrls = urls.filter(url => /^https?:\/\/.*\.\w+(\/.*\w||\/)*$/.test(url));
    const badUrls = originalUrls.filter(url => !cleanUrls.includes(url));
    if (badUrls.length > 0) {
        console.log(`Bad URLs: ${badUrls}`);
        //throw `Bad URL: ${badUrls}`;
    }
    console.log(cleanUrls);
    return cleanUrls;
}

module.exports = processUrls;