const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()

morgan.token('post_info', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_info'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const password = process.argv[2]
const url = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
  
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
  Person.find({})
  .then(persons => {
    if (persons.length > 0) {
      response.json(persons)
    } else {
      response.status(404).end()
    }
  })
})

app.get('/info', async (request,response) => {
    let personNo = await Person.countDocuments({})
    let dateTime = new Date().toString()
    dateTime = dateTime .substring(0, 25)
    response.send(`Phonebook has info for ${personNo} people <br/> <br/>
    ${dateTime} GMT+0300 Eastern European Summer Time`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
