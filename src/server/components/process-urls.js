function processUrls(urlArray) {
    // Split the string of urls in the request, then
    // return only the strings that
    // 1. Start with 'http(s)://'
    // 2. Contains a domain name (one or more alphanumeric characters)
    // 3. Has a TLD (one or more alphanumeric characters)
    // 4. Has any number of segments starting with forward slashes
    // 5. End with an alphanumeric character OR a trailing slash
    let urls = urlArray.split('\n');
    const originalUrls = [...urls];
    let cleanUrls = urls.filter(url => /^https?:\/\/.*\.\w+(\/.*\w||\/)*$/.test(url));
    const badUrls = originalUrls.filter(url => !cleanUrls.includes(url));
    if (badUrls.length > 0) {
        console.log(`Bad URLs: ${badUrls}`);
    }
    console.log(`Clean URLs: ${cleanUrls}`);
    return [cleanUrls, badUrls.join('\n')];
}

module.exports = processUrls;