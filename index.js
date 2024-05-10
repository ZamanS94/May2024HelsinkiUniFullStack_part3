// online link https://may2024helsinkiunifullstack-part3-1.onrender.com/

const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('post_info', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else return null
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_info'))
app.use(express.json())
app.use(cors())


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "Mary", 
        "number": "39-23-6423122"
      },
    { 
        "id": 6,
        "name": "Sabina", 
        "number": "0000"
      }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    if(persons){
        response.json(persons)
    }
    else{
        response.status(404).end()
    }
})

app.get('/info',(request,response) => {
    let dateTime = new Date().toString()
    dateTime = dateTime .substring(0, 25)
    response.send(`Phonebook has info for ${persons.length} people <br/> <br/>
    ${dateTime} GMT+0300 Eastern European Summer Time`)
}
)

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personIndex = persons.findIndex(person => person.id === id)
    if (personIndex !== -1) {
        persons.splice(personIndex, 1)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})




const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
    const randomPart = Math.floor(Math.random() * 1000) + 1
    return maxId + randomPart
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name||!body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    let doesExist = persons.find(person => person.name === body.name)

    if(doesExist){
        return response.status(422).json({ error: 'name must be unique' })
    }
    const personObject = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(personObject)
    response.json(persons)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
