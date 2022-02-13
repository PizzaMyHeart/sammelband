const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const session = require('express-session');
const { exec } = require('child_process');
const wkhtmltopdf = require('wkhtmltopdf');

const app = express();



app.use(['/', '/submit', '/download'], session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))
app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));
const port = 3001;

const styles = require('./styles'); // Load CSS styles from ./styles.js




function cleanParsedArticle(output) {
    return output.split('\n').join('<br/>')
}



async function fetchFromURL(urls) {
    let documents = [];
    for (let url of urls) {
        console.log(url);
        await axios.get(url)
        .then(res => {
            documents.push(res.data);
        })
        .catch(err => console.log(err));
    }
    //console.log('Documents: ', documents);
    return documents;   

}

function pandoc(to, id) {
    console.log('pandoc()');
    let filepath = path.join(__dirname, './public', `sammelband-${id}.pdf`);
    exec(`pandoc -t html5 ${filepath}`, (error, stdout, stderr) => {
        if (error) console.log(error);
        if (stderr) console.log(stderr);
        console.log(`stdout: ${stdout}`);
    });
}

function htmlToPDF(id) {
    console.log('htmlToPDF()');
    let filepath = path.join(__dirname, './public', `sammelband-${id}`);
    //wkhtmltopdf(fs.readFileSync(filepath + '.html', 'utf-8'), { output: filepath + '.pdf'}); 
    // ^ This doesn't work. Might be better off without the node wrapper.
    exec(`wkhtmltopdf --encoding utf-8 ${filepath + '.html'} ${filepath + '.pdf'}`);
}

function writeToFile(parsedArticles, id) {
    //fs.unlinkSync('./public/sammelband.html');
    let filepath = `./public/sammelband-${id}.html`;
    // Add styles to top of html file
    fs.writeFile(filepath, styles.styles, { flag: 'a+' }, err => {if (err) throw err;});
    for (article of parsedArticles) {
        let content = `<h1>Title: ${article.title}</h1><br>${article.content}<br>---<br>`;
        fs.writeFile(filepath, content, { flag: 'a+' }, err => {if (err) throw err;});
    }

}

// mozilla/readability version
function parseDocuments(documents) {
    console.log('parseDocuments()');
    //console.log(documents)
    let parsedArticles = [];
    documents.forEach(document => {
        let doc = new JSDOM(document);
        let reader = new Readability(doc.window.document);
        let article = reader.parse();
        console.log('Parsed:...')
        //console.log(article);
        parsedArticles.push(article);
    })
    //console.log('parsedArticles', parsedArticles);
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
    console.log(req.body);
    console.log(req.session.id);
    const urls = req.body.urls.split('\n');
    console.log(urls);
    fetchFromURL(urls)
        .then(documents => parseDocuments(documents))
        .then(parsedArticles => writeToFile(parsedArticles, req.session.id))
        .then(() => htmlToPDF(req.session.id));

    res.end();
    
}



app.use('/submit', postHandler);


app.get('/', (req, res) => {
    console.log(req.session.id);
    res.send('You absolute genius');
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    return;
});

app.get('/download', (req, res) => {
    console.log(req.session.id);
    //res.set('Access-Control-Allow-Origin', '*');
    res.download(
        path.join(__dirname, './public', `sammelband-${req.session.id}.html`), 
        'sammelband.html',
        err => {if (err) console.log(err)}
        );
    console.log('Sammelband downloaded');
});

app.get('/delete', (req, res) => {
    console.log('deleting sammelband');
    console.log(req.session.id);
    fs.unlinkSync(path.join(__dirname, './public', `sammelband-${req.session.id}.html`));
    console.log('Sammelband deleted');
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

