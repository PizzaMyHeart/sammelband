const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

// mozilla/readability version
/*
Given an object of url properties with HTML document strings as values, run each string through the @mozilla/readability 
parser and return them all in another object. 
*/
function parseDocuments(documents) {
    console.log('parseDocuments()');

    let parsedArticles = {};
    Object.keys(documents).forEach(key => {
        let doc = new JSDOM(documents[key]);
        let reader = new Readability(doc.window.document);
        let article = reader.parse();
        console.log('Parsed:...');
        parsedArticles[key] = article;
    })
    return parsedArticles;
}

module.exports = parseDocuments;