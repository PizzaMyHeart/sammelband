const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const Epub = require('epub-gen');
const puppeteer = require('puppeteer');
require('dotenv').config();
const processUrls = require('./components/process-urls');
const fetchFromURL = require('./components/fetch-from-url');
const parseDocuments = require('./components/parse-documents');
const mail = require('./components/mail');

let browser;

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

function convertFromHTML(format, id, documents) {
    let filepath = path.join(__dirname, './public', `sammelband-${id}`);
    switch(format) {
        case 'pdf':
            htmlToPDF(filepath);
            break;
        case 'html':
             break;
        case 'epub':
            htmlToEPUB(filepath, documents);
            break;
    }
}

function htmlToPDF(filepath) {
    console.log('htmlToPDF()');
    const options = {
        path: filepath + '.pdf',
        printBackground: true
    };
    (async() => {
        if (!browser) {
            browser = await puppeteer.launch();
        }
        const page = await browser.newPage();
        await page.setContent(fs.readFileSync(filepath + '.html', 'utf8'));
        await page.emulateMediaType('screen');
        await page.pdf(options);
        await page.close();
    })();
}

function htmlToEPUB(filepath, documents) {
    console.log('htmlToEPUB()');
    let option = {
        title: 'Sammelband',
        content: []
    };
    for (document of documents) {
        option.content.push({title: document.title, data: document.content})
    };
    console.log(option);
    new Epub(option, filepath + '.epub');
}

function applyStyle(color, font) {
    console.log(`Style: ${font}`);
    console.log(`Color: ${color}`);
    return styles.head + 
            styles.base + 
            ((font=='sansSerif') ? styles.sansSerif : styles.serif) + 
            ((color=='dark') ? styles.dark : styles.light) +
            styles.tail;
}

function writeToFile(parsedArticles, req) {
    let id = req.session.id;
    //fs.unlinkSync('./public/sammelband.html');
    let filepath = `./public/sammelband-${id}.html`;
    // Add styles to top of html file
    console.log(req.body.color);
    fs.writeFile(filepath, '', { flag: 'w+' }, err => {if (err) console.log(err)});
    fs.writeFile(filepath, applyStyle(req.body.color, req.body.font), { flag: 'a+' }, err => {if (err) throw err;});
    
    for (let i = 0; i < parsedArticles.length; i++) {
        // "break-before" is a Gutenberg CSS class that places the element on a new page
        // We don't want the first article to be broken onto a new page
        // https://github.com/BafS/Gutenberg#force-break-page
        let breakBefore;
        i == 0 ? breakBefore = '' : breakBefore = 'break-before';
        let content = `<h1 class="${breakBefore}">Article #${i+1}: ${parsedArticles[i].title}</h1><br>${parsedArticles[i].content}<hr>`;
        fs.writeFile(filepath, content, { flag: 'a+' }, err => {if (err) console.log(err)});
    }
    return parsedArticles;
}

let format;
function download(res, id, format) {
    const filepath = path.join(__dirname, `public/sammelband-${id}.${format}`);
    res.download(filepath, `sammelband.${format}`, err => {if (err) console.log(err)});
    console.log(`sammelband.${format} downloaded.`)
}

var postHandler = function (req, res) {
    console.log(req.body);
    console.log(req.session.id);
    req.session.body = req.body;
    // Split the string of urls in the request, then
    // return only the strings that
    // 1. Start with 'http(s)://'
    // 2. Contains a domain name (one or more alphanumeric characters)
    // 3. Has a TLD (one or more alphanumeric characters)
    // 4. Has any number of segments starting with forward slashes
    // 5. End with an alphanumeric character OR a trailing slash
    /*
    let urls = req.body.urls.split('\n');
    const originalUrls = [...urls];
    urls = urls.filter(url => /^https?:\/\/.*\.\w+(\/.*\w||\/)*$/.test(url));
    const badUrls = originalUrls.filter(url => !urls.includes(url));
    if (badUrls.length > 0) {
        console.log(`Bad URLs: ${badUrls}`);
        //throw `Bad URL: ${badUrls}`;
    }
    console.log(urls);
    */
    format = req.body.format;
    /*
    fetchFromURL(urls)
        .then(documents => parseDocuments(documents), err => {
            console.log('Axios error');
        })
        .then(parsedArticles => writeToFile(parsedArticles, req))
        .then((parsedArticles) => convertFromHTML(req.body.format, req.session.id, parsedArticles))
        .then(() => res.send('Sammelband ready when you are.'));
        
    */
    (async () => {
        const [urls, badUrls] = processUrls(req.body.urls);
        await fetchFromURL(urls)
        .catch(err => {
            console.log(err);
            throw err;
        })
        .then(documents => parseDocuments(documents))
        .then(parsedArticles => writeToFile(parsedArticles, req))
        .then((parsedArticles) => convertFromHTML(req.body.format, req.session.id, parsedArticles))
        .then(() => {
            let body = {malformedUrl: null, ready: true};
            if (badUrls.length > 0) body.malformedUrl = badUrls;
            res.send(body);
        })
        .catch(err => {
            res.status(500).send(err);
        });
    })();
    //res.end();
    
}


//app.use('/submit', postHandler);


app.get('/', (req, res) => {
    console.log(req.session.id);
    res.send('You absolute genius');
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    postHandler(req, res);
    return;
});

app.get('/download', (req, res) => {
    download(res, req.session.id, format);
});

app.get('/mail', (req, res) => {
    console.log('req.session.body: ', req.session.body);
    mail(req.session.id, req.session.body.email, res).catch(console.error);
})

function deleteFile(res, id) {
    console.log('deleting sammelband');
    console.log(id);
    fs.readdirSync(path.join(__dirname, `public/`))
    .filter(filename => filename.includes(id))
    .map(filename => fs.unlinkSync(path.join(__dirname, `public/${filename}`)));
    res.send('Sammelband deleted');
    console.log('Sammelband deleted');
}

app.get('/delete', (req, res) => {
   deleteFile(res, req.session.id);
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

