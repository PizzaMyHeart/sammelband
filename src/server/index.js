const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
let RedisStore = require("connect-redis")(session);
const Epub = require('epub-gen');
const puppeteer = require('puppeteer');
require('dotenv').config();
const processUrls = require('./components/process-urls');
const fetchFromURL = require('./components/fetch-from-url');
const parseDocuments = require('./components/parse-documents');
const mail = require('./components/mail');
const { getPocketToken, getPocketList }= require('./components/pocket');

let browser; 

const app = express();


const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)


app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  )

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
const port = 3001;

const styles = require('./styles'); // Load CSS styles from ./styles.js

async function convertFromHTML(format, id, documents) {
    let filepath = path.join(__dirname, './public', `sammelband-${id}`);
    console.log(filepath);
    switch(format) {
        case 'pdf':
            await htmlToPDF(filepath).then(console.log).catch(console.log);
            break;
        case 'html':
             break;
        case 'epub':
            await htmlToEPUB(filepath, documents).then(console.log).catch(console.log);
            break;
    }
    return true; // signifies that file is ready for download
}

async function getHtmlContents(filepath) {
    try {
        return fs.promises.readFile(filepath, 'utf8');
    } catch (err) {
        throw err;
    }
    /*
    return new Promise((resolve, reject) =>  {
        try {
            fs.readFile(filepath, 'utf8', (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        } catch (err) {
            throw(err)
        }
    })
    */

}

function htmlToPDF(filepath) {
    console.log('htmlToPDF()');
    const options = {
        path: filepath + '.pdf',
        printBackground: true
    };
    console.log(options);
    return new Promise((resolve, reject) => {
        (async() => {
            if (!browser) {
                browser = await puppeteer.launch();
            }
            const page = await browser.newPage();
            const contents = await getHtmlContents(filepath + '.html');
            console.log(contents);
            await page.setContent(contents);
            //await page.setContent(fs.readFileSync(filepath + '.html', 'utf8'));
            await page.emulateMediaType('screen');
            await page.pdf(options);
            await page.close();
            resolve('PDF ready');
        })();
    })
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
    return new Promise((resolve, reject) => {
        new Epub(option, filepath + '.epub');
        resolve('EPUB ready');
    })
}

function applyStyle(color, font) {
    //console.log(`Style: ${font}`);
    //console.log(`Color: ${color}`);
    return styles.head + 
            styles.base + 
            ((font=='sansSerif') ? styles.sansSerif : styles.serif) + 
            ((color=='dark') ? styles.dark : styles.light) +
            styles.tail;
}

function writeToFile(parsedArticles, req) {
    console.log('writeToFile');
    let id = req.session.id;
    //fs.unlinkSync('./public/sammelband.html');
    let filepath = `./public/sammelband-${id}.html`;
    console.log(`${id}\n${filepath}`);
    // Add styles to top of html file
    //console.log(req.body.color);
    fs.writeFile(filepath, '', { flag: 'w+' }, err => {if (err) console.log(err)});
    fs.writeFile(filepath, applyStyle(req.body.color, req.body.font), { flag: 'a+' }, err => {if (err) throw err;});
    
    for (let i = 0; i < parsedArticles.length; i++) {
        // "break-before" is a Gutenberg CSS class that places the element on a new page
        // We don't want the first article to be broken onto a new page
        // https://github.com/BafS/Gutenberg#force-break-page
        let breakBefore;
        i == 0 ? breakBefore = '' : breakBefore = 'break-before';
        let author; let siteName;
        parsedArticles[i].byline ? author = `by ${parsedArticles[i].byline}` : author = '';
        parsedArticles[i].siteName ? siteName = `, ${parsedArticles[i].siteName}` : siteName = '';
        let content = `<h1 class="${breakBefore}">❧ ${parsedArticles[i].title} ☙</h1><br>
                        <p><i>${author}${siteName}</i></p><br>
                        ${parsedArticles[i].content}<hr>`;
        fs.writeFile(filepath, content, { flag: 'a+' }, err => {if (err) console.log(err)});
    }
    return parsedArticles;
}


function download(res, id, format) {
    console.log('download()');
    const filepath = path.join(__dirname, `public/sammelband-${id}.${format}`);
    console.log(`${filepath}`)
    res.download(filepath, `sammelband.${format}`, err => {
        if (err) console.log(err);
        else console.log(`sammelband.${format} downloaded.`);
    });
    
}

function handleSubmit (req, res) {
    req.session.body = req.body;
    console.log(req.session.id);

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
        .then((fileReady) => {
            if (fileReady) {
                console.log('File ready');
                let body = {malformedUrl: null, ready: true};
                if (badUrls.length > 0) body.malformedUrl = badUrls;
                res.send(body);
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
    })();
    
}



app.get('/api', (req, res) => {
    console.log('Session ID: ', req.session.id);
    let body = {};
    console.log(req.session.pocketAccessToken);
    // Set Pocket logged in state for front-end
    if (req.session.pocketAccessToken) body.pocketLoggedIn = true;
    else if(!req.session.pocketAccessToken) body.pocketLoggedIn = false;
    console.log(body);
    res.json(body);
});

app.post('/api/pocket/request', async (req, res) => {
    console.log('Session ID: ', req.session.id);
    try {
        let response = await getPocketToken('request');
        console.log('req token: ', response.data.code);
        req.session.pocketRequestToken = response.data.code; // Save the user's Pocket request token
        res.json({requestToken: response.data.code});
    }

    catch (err) {
        console.log(err);
    }
});



app.get('/api/pocket/callback', async (req, res) => {
    console.log('callback page');
    console.log('Session ID: ', req.session.id);
    try {
        let response = await getPocketToken('access', req.session.pocketRequestToken);
        console.log('Access token: ', response.data.access_token);
        req.session.pocketAccessToken = response.data.access_token;
        res.redirect('http://localhost:3000');
    }
    catch (err) {
        console.log(err);
    }
});
        
app.get('/api/pocket/list', async (req, res) => {
    console.log('Session ID: ', req.session.id);
    try {
        const accessToken = req.session.pocketAccessToken;
        console.log(accessToken);
        let response = await getPocketList(accessToken);
        //console.log(response.data);
        res.send(response.data);
    }
    catch (err) {
        console.log(err);

    }
});

app.post('/api/submit', (req, res) => {
    console.log('Session ID: ', req.session.id);
    console.log(req.body);
    handleSubmit(req, res);
});

app.get('/api/download', (req, res) => {
    console.log('Session ID: ', req.session.id);
    download(res, req.session.id, req.session.body.format);
});



app.get('/api/mail', (req, res) => {
    console.log('Session ID: ', req.session.id);
    console.log(req.query);
    mail(req, res).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
})



function deleteFile(id) {
    console.log('deleteFile()');
    console.log('deleting sammelband');
    console.log(id);
    fs.readdirSync(path.join(__dirname, `public/`))
    .filter(filename => filename.includes(id))
    .map(filename => fs.unlinkSync(path.join(__dirname, `public/${filename}`)));
    console.log('Sammelband deleted');
}

app.get('/api/delete', (req, res) => {
    console.log('Session ID: ', req.session.id);
    deleteFile(req.session.id);
    res.send('Sammelband deleted');
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

