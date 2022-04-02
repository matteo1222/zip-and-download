const express = require('express')
const fs = require('fs')
const { Base64Encode } = require('base64-stream')
const async = require('async')
const path = require('path')
const Archiver = require('archiver')

const app = express()
const PORT = 8888

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/download', async (req, res) => {
    console.log(process.memoryUsage())
    res.set('Content-Type','application/zip');
    res.set('Content-disposition', 'attachment; filename=myFile.zip')

    // Create zip file
    const zip = new Archiver('zip')

    zip
        .pipe(new Base64Encode())
        .pipe(res)

    // Go through directory and add files
    const parentDir = path.join(__dirname, 'files')

    async.waterfall([
        function (cb) {
            fs.readdir(parentDir, cb);
        },
        function (files, cb) {
            // Consume 10 files in parallel.
            async.eachLimit(files, 10, function (filename, done) {
                const filePath = path.join(parentDir, filename)

                if (fs.statSync(filePath).isFile()) {
                    const stream = fs.createReadStream(filePath)
                    zip.append(stream, { name: filename })
                }
                done()
            }, cb)
        }
    ], function (err) {
        err && console.trace(err)
        if (!err) {
            console.log('Done adding files')
            // Send data to client
            console.log(process.memoryUsage())
            zip.finalize()
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}.`)
})