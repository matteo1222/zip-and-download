const express = require('express')
const zipDirectory = require('./zipDirectory')
const path = require('path')

const app = express()
const PORT = 8888

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/download', async (req, res) => {
    // Start zipping
    const zip = await zipDirectory('./files')
    const data = await zip.generateAsync({ type: 'base64' })
    // TODO: use stream instead
    res.send(data)
})
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}.`)
})