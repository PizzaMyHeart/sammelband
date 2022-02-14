const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const session = require('express-session');
const { exec } = require('child_process');
const Epub = require('epub-gen');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
require('dotenv').config();
const fetchFromURL = require('./components/fetch-from-url')

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
/*
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
    return documents;   

}
*/

function convertFromHTML(format, id) {
    let filepath = path.join(__dirname, './public', `sammelband-${id}`);
    switch(format) {
        case 'pdf':
            htmlToPDF(filepath);
            break;
        case 'html':
             break;
        case 'epub':
            htmlToEPUB(filepath);
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

function htmlToEPUB(filepath) {
    console.log('htmlToEPUB()');
    let option = {
        title: 'Sammelband',
        content: []
    };
    for (article of articles) {
        option.content.push({title: article.title, data: article.content})
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
    for (article of parsedArticles) {
        let content = `<h1>Title: ${article.title}</h1><br>${article.content}<br>---<br>`;
        fs.writeFile(filepath, content, { flag: 'a+' }, err => {if (err) throw err;});
    }

}
let articles;
// mozilla/readability version
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
    articles = [...parsedArticles];
    //console.log('parsedArticles', parsedArticles);
    return parsedArticles;
}
let format;
function download(res, id, format) {
    const filepath = path.join(__dirname, `public/sammelband-${id}.${format}`);
    res.download(filepath, `sammelband.${format}`, err => {if (err) console.log(err)});
    console.log(`sammelband.${format} downloaded.`)
}


async function mail(id) {
    console.log(`sessionID for email: ${id}`);
    const html = fs.readFileSync(path.join(__dirname, `public/sammelband-${id}.html`), 'utf8');

    let transporter = nodemailer.createTransport({
        pool: true,
        host:'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: 'bound@sammelband.app',
            pass: process.env.MAIL_PASSWORD
        }
    });


    let info = await transporter.sendMail({
        from: '<bound@sammelband.app>',
        to: 'ian_tan@hotmail.com',
        subject: 'Sammelband',
        html: html
    });

    console.log(`Message sent: ${info.messageId}`);
    
}

var postHandler = function (req, res, next) {
    console.log(req.body);
    console.log(req.session.id);
    const urls = req.body.urls.split('\n');
    console.log(urls);
    format = req.body.format;
    fetchFromURL(urls)
        .then(documents => parseDocuments(documents))
        .then(parsedArticles => writeToFile(parsedArticles, req))
        .then(() => convertFromHTML(req.body.format, req.session.id))
        .then(() => res.send('Sammelband ready when you are.'));
    
    //res.end();
    
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
    download(res, req.session.id, format);
});

app.get('/mail', (req, res) => {
    mail(req.session.id).catch(console.error);
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
    /*
    console.log('deleting sammelband');
    console.log(req.session.id);
    fs.unlinkSync(path.join(__dirname, './public', `sammelband-${req.session.id}.html`));
    res.send('Sammelband deleted');
    console.log('Sammelband deleted');
    */
   deleteFile(res, req.session.id);
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

