const Epub = require('epub-gen');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');



async function convertFromHtml(format, id, documents, browser) {
    let filepath = path.join(__dirname, '../public', `sammelband-${id}`);
    console.log(filepath);
    switch(format) {
        case 'pdf':
            await htmlToPDF(filepath, browser).then(console.log).catch(console.log);
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
    return fs.promises.readFile(filepath, 'utf8')
               .then(contents => contents)
               .catch(console.log);
}

function htmlToPDF(filepath, browser) {
    // Converts HTML file to PDF, but checks first whether 
    // the puppeteer browser object exists
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

module.exports = convertFromHtml;