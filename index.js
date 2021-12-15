const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path')
const http = require('http');
const jsonfile = require('jsonfile')

const app = express();
const httpServer = http.createServer(app);
const data = require('./data/Drawing2.json');

app.use(cors())
app.use('/', express.static(path.join(__dirname, './public')));

app.get('/api', (req, res) => {
  res.send('hello')
})

const result = {};

data.object.children[0].children.forEach((object) => {
  if (object.name.includes('Sector')) {
    const geometry = data.geometries.find((geo) => geo.uuid === object.children[0].children[0].geometry)
    const coord = geometry.data.attributes.position.array.toString().split(',0,')
      .map((el) => ({x: Number(el.split(',')[0]), y: Number(el.split(',')[1])}))
    
    if (!result[object.name]) {
      result[object.name] = {
        room: coord
      }
    } else result[object.name].room = coord
    
  }
  if (object.name.includes('Seat')) {
    const sector = `Sector-${object.name.split('-')[1]}`;
    console.log(object.children[0].children[0].geometry)
    object.children.forEach((seat) => {
      const geometry = data.geometries.find((geo) => geo.uuid === seat.children[0].geometry);
      const coord = geometry.data.attributes.position.array.toString().split(',0,')
        .map((el) => ({x: Number(el.split(',')[0]), y: Number(el.split(',')[1])}))
      
      if (!result[sector]) {
        result[sector] = {
          seats: [coord]
        }
      } else if (result[sector] && !result[sector].seats) {
        result[sector].seats = [coord]
      } else {
        result[sector].seats.push(coord)
      }
    })
  }
})

jsonfile.writeFile('./public/test4.json', Object.values(result), function (err) {
  if (err) console.error(err)
})

httpServer.listen(8000, async () => {
  console.log('Listening on port 8000');
});
