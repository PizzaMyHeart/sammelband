const fs = require('fs');
const path = require('path');

async function deleteFile(id) {
    const filepath = (path.join(__dirname, '../public/'));
    console.log('deleteFile()');
    console.log('deleting sammelband');
    console.log(id);
    fs.promises.readdir(filepath)
    .then(files => {
        // Delete the files whose paths contain the user's session ID
        files.filter(filename => filename.includes(id))
             .map(filename => {
                fs.promises.unlink(path.join(`${filepath}${filename}`))
             })
    })
    .then(() => console.log('Sammelband deleted'))
    .catch(console.log);
    /*
    async function listDir() {
        // Return an array of the paths of all files in the /public directory (user-generated files)
        try {
            return fs.promises.readdir(path.join(__dirname, 'public/'));
        } catch (err) {
            console.log(err);
        }
    }
    */
   /*
   (await listDir())
    .filter(filename => filename.includes(id))
    .map(filename => {
        // Delete the files whose paths contain the user's session ID
        fs.promises.unlink(path.join(__dirname, `public/${filename}`))
    });
    */
    

    //console.log('Sammelband deleted');
}

module.exports = deleteFile;