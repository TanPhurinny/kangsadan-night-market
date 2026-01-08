import express from 'express' // เปลี่ยนจาก require เป็น import
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Kangsadan Night Market! (ES Module)')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
