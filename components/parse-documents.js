const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

// mozilla/readability version
/*
Given an array of HTML document strings, run each string through the @mozilla/readability 
parser and return them as an array. 
*/
function parseDocuments(documents) {
    console.log('parseDocuments()');
    let parsedArticles = [];
    documents.forEach(document => {
        let doc = new JSDOM(document);
        let reader = new Readability(doc.window.document);
        let article = reader.parse();
        console.log('Parsed:...');
        parsedArticles.push(article);
    })
    return parsedArticles;
}

module.exports = parseDocuments;