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
      } else res.status(404).end()
    })
})

app.get('/info', async (req, res) => {
  const personCount = await Person.countDocuments({})
  const dateTime = new Date().toString().substring(0, 25)
  res.send(`Phonebook has info for ${personCount} people <br/> <br/> ${dateTime} GMT+0300 Eastern European Summer Time`)
})

app.post('/api/persons', async (request, response) => {

  const body = request.body
  if (!body.name || !body.number) return response.status(400).json({ error: "name or number missing" })

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedNote => {
    response.json(savedNote)
  })
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
