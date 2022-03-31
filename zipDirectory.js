const JSZip = require('jszip')
const fs = require('fs').promises
const path = require('path')

async function zipDirectory (directoryPath = '') {
    const zip = new JSZip()
    const files = await fs.readdir(directoryPath)

    for (let file of files) {
        const filePath = path.join(directoryPath, file)

        if ((await fs.stat(filePath)).isFile()) {
            const content = await fs.readFile(filePath)
            zip.file(filePath, content)
        }
    }

    return zip
}

module.exports = zipDirectory