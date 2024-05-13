const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

require('dotenv').config()

morgan.token('post_info', function (req, res) {
  if (req.method === 'POST') {
      return JSON.stringify(req.body)
  } else return null
})

const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_info'))
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    if (persons.length > 0) {
      res.json(persons)
    } else {
      const error = new Error('Persons not found')
      error.status = 404
      throw error
    }
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (req, res) => {
  const personCount = await Person.countDocuments({})
  const dateTime = new Date().toString().substring(0, 25)
  res.send(`Phonebook has info for ${personCount} people <br/> <br/> ${dateTime} GMT+0300 Eastern European Summer Time`)
})

app.post('/api/persons', async (request, response, next) => {
  try {
    const body = request.body
    if (!body.name || !body.number) {
      const error = new Error('Name or number missing')
      error.status = 400
      throw error
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })
    const savedPerson = await person.save()
    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(request.params.id, person, { new: true })
    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})




app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const result = await Person.findByIdAndDelete(request.params.id)
    if (result) {
      response.status(204).end()
    } else {
      const error = new Error('Person not found')
      error.status = 404
      throw error
    }
  } catch (error) {
    next(error)
  }
})

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
