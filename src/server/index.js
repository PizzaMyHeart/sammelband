const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mercury = require('@postlight/mercury-parser');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const app = express();
const port = 3001;

const styles = require('./styles'); // Load CSS styles from ./styles.js

function cleanParsedArticle(output) {
    return output.split('\n').join('<br/>')
}

function addStyles() {
    fs.writeFile('./public/sammelband.html', styles.styles, { flag: 'a+' }, err => {if (err) throw err;});
}

async function fetchFromURL(urls) {
    let documents = [];
    for (let url of urls) {
        console.log(url);
        await axios.get(url)
        .then(res => {
            documents.push(res.data);
        })
    }
    console.log('Documents: ', documents);
    return documents;   

}

function writeToFile(parsedArticles) {
    fs.unlinkSync('./public/sammelband.html');
    addStyles();
    for (item of parsedArticles) {
        fs.writeFile('./public/sammelband.html', item, { flag: 'a+' }, err => {if (err) throw err;});
    }
}

// mozilla/readability version
function parseDocuments(documents) {
    console.log('parseDocuments()');
    console.log(documents)
    let parsedArticles = [];
    documents.forEach(document => {
        let doc = new JSDOM(document);
        let reader = new Readability(doc.window.document);
        let article = reader.parse();
        console.log('Parsed:...')
        console.log(article);
        parsedArticles.push(article.content);
    })
    console.log('parsedArticles', parsedArticles);
    return parsedArticles;
}

// mercury-parser version
/*
function parseFromURL(url) {
    console.log('parseFromURL()');

    //let reader = new Readability();
    
    mercury.parse(url)
    .then(result => {
        console.log(result);
        parsed = cleanParsedArticle(result.content);
        let parsedArticles = [];
        parsedArticles.push(parsed);
        //console.log(parsedArticles);
        for (item of parsedArticles) {
            fs.writeFile('./public/sammelband.html', item, { flag: 'a+' }, err => {if (err) throw err;});
        };
    });
    
}
*/
var postHandler = function (req, res, next) {
    console.log('getHTMLDocumtent()');
    
    const urls = req.body.urls.split('\n');
    console.log(urls);
    fetchFromURL(urls)
        .then(documents => parseDocuments(documents))
        .then(parsedArticles => writeToFile(parsedArticles));
    
   
    
    
    /*
    urls.forEach(url => {
        parseFromURL(url)
    });
    */
    /*
    mercury.parse(url)
    .then(result => {
        console.log(result);
        parsed = result.content.split('\n').join('<br/>')
        parsedArticles.push(parsed);
        //console.log(parsedArticles);
        for (item of parsedArticles) {
            fs.writeFile('./public/sammelband.html', item, { flag: 'a+' }, err => {if (err) throw err;});
        };

    });
    
    */


    res.end();
}


app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/article_urls', postHandler);

app.get('/', (req, res) => {
    res.send('You absolute genius');
});

app.post('/article_urls', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.body);
    return;
});

app.get('/download', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.download(path.join(__dirname, 'public', 'sammelband.html'));
    console.log('Sammelband downloaded');
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

