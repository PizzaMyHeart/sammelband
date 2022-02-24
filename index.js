const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
let RedisStore = require("connect-redis")(session);
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const puppeteer = require('puppeteer');
const processUrls = require('./components/process-urls');
const fetchFromURL = require('./components/fetch-from-url');
const parseDocuments = require('./components/parse-documents');
const convertFromHtml = require('./components/convert-from-html');
const mail = require('./components/mail');
const { getPocketToken, getPocketList }= require('./components/pocket');
const deleteFile = require('./components/delete-file');



const app = express();

// Initialize a Puppeteer browser instance, reuse for subsequent requests
let browser;
(async () => {
    browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: [
            '--no-sandbox', 
            '--headless', 
            '--disable-gpu', 
            '--disable-features=site-per-process',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
        ]
    })
})();

const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1-minute window
    max: 60,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(rateLimiter);


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
    // origin needs to be set explicitly to allow fetch() calls from the front-end
    // to include cookies in the request (credentials: include)
    origin: process.env.CLIENT_DOMAIN.split(','), 
    credentials: true
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3001; // for Heroku deployment

const styles = require('./styles'); // Load CSS styles from ./styles.js



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
    console.log('download()', format);
    const filepath = path.join(__dirname, `public/sammelband-${id}.${format}`);
    console.log(`${filepath}`)
    res.download(filepath, `sammelband.${format}`, err => {
        if (err) console.log(err);
        else console.log(`sammelband.${format} downloaded.`);
    });
    
}

function handleSubmit (req, res) {
    // Executes when request is made to /api/submit
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
        .then((parsedArticles) => convertFromHtml(req.body.format, req.session.id, parsedArticles, browser))
        .then((fileReady) => {
            if (fileReady) {
                console.log('File ready');
                let body = {malformedUrl: null, ready: true};
                if (badUrls.length > 0) body.malformedUrl = badUrls;
                res.send(body);
            }
        })
        .catch(err => {
            console.log(err);
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





app.get('/api/delete', async (req, res) => {
    console.log('Session ID: ', req.session.id);
    await deleteFile(req.session.id);
    res.send('Sammelband deleted');
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

