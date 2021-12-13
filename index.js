const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path')
const http = require('http');
const jsonfile = require('jsonfile')

const app = express();
const httpServer = http.createServer(app);
const data = require('./data/data_full.js');

app.use(cors())
app.use('/', express.static(path.join(__dirname, './public')));

app.get('/api', (req, res) => {
  res.send('hello')
})

const arr = data.geometries
  .map((item) => item.data.attributes.position.array.toString().split(',0,'))
  .slice(0, 3)
  // .reduce((acc, item) => ([...acc, ...item]),[])
  .map((item) => {
    return {room: item.map((el) => ({x: Number(el.split(',')[0]), y: Number(el.split(',')[1])})), data: []}
  })

  data.geometries
  .map((item) => item.data.attributes.position.array.toString().split(',0,'))
  .slice(3, 45)
  .forEach((item) => {
    arr[0].data.push(item.map((el) => ({x: Number(el.split(',')[0]), y: Number(el.split(',')[1])})))
  })

jsonfile.writeFile('./public/test4.json', arr, function (err) {
  if (err) console.error(err)
})

httpServer.listen(8000, async () => {
  console.log('Listening on port 8000');
});
