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

/*
app.use(['/', '/submit', '/download'], session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))
*/
/*
app.use(cookieParser());
app.use(['/', '/submit', '/download'], cookieSession({
    secret: process.env.SESSION_SECRET,
    saveUnintialized: true,
    resave: false,
    cookie: {
        secure: false
    }
}));
*/
app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));
const port = 3001;

const styles = require('./styles'); // Load CSS styles from ./styles.js

function convertFromHTML(format, id, documents) {
    let filepath = path.join(__dirname, './public', `sammelband-${id}`);
    console.log(filepath);
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
    return true; // signifies that file is ready for download
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
        parsedArticles[i].byline ? author = `by ${parsedArticles[i].byline}, ` : author = '';
        parsedArticles[i].siteName ? siteName = parsedArticles[i].siteName : siteName = '';
        let content = `<h1 class="${breakBefore}">Article #${i+1}: ${parsedArticles[i].title}</h1><br>
                        <p><i>${author}${siteName}</i></p><br>
                        ${parsedArticles[i].content}<hr>`;
        fs.writeFile(filepath, content, { flag: 'a+' }, err => {if (err) console.log(err)});
    }
    return parsedArticles;
}

let format;
function download(res, id, format) {
    console.log('download()');
    const filepath = path.join(__dirname, `public/sammelband-${id}.${format}`);
    console.log(`${filepath}`)
    res.download(filepath, `sammelband.${format}`, err => {
        if (err) console.log(err);
        else console.log(`sammelband.${format} downloaded.`);
    });
    
}

var postHandler = function (req, res) {
    req.session.body = req.body;
    console.log(req.session.id);
    format = req.body.format;

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
    //res.end();
    
}


//app.use('/submit', postHandler);


app.get('/', (req, res) => {
    console.log(req.session.id)
    res.send('You absolute genius');
});

app.post('/submit', (req, res) => {
    //console.log(req.body);
    console.log(req.session);
    postHandler(req, res);
    return;
});

app.get('/download', (req, res) => {
    console.log('/download', req.session.id);
    download(res, req.session.id, format);
});

app.get('/mail', (req, res) => {
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

app.get('/delete', (req, res) => {
   deleteFile(req.session.id);
   res.send('Sammelband deleted');
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

