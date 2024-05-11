const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      if (persons.length > 0) {
        res.json(persons)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.error('Error fetching persons:', error)
      res.status(500).json({ error: 'Internal server error' })
    })
})

app.get('/info', async (req, res) => {
  try {
    const personCount = await Person.countDocuments({})
    const dateTime = new Date().toString().substring(0, 25)
    res.send(`Phonebook has info for ${personCount} people <br/> <br/> ${dateTime} GMT+0300 Eastern European Summer Time`)
  } catch (error) {
    console.error('Error fetching person count:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
