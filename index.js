const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const morgan = require('morgan')
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
        id: 1,
        name: 'Arto Hellas', 
        number: '040-123456' 
    },
    { 
        id: 2,
        name: 'Ada Lovelace', 
        number: '39-44-5323523' 
    },
    { 
        id: 3,
        name: 'Dan Abramov', 
        number: '12-43-234345' 
    },
    { 
        id: 4,
        name: 'Mary Poppendieck', 
        number: '39-23-6423122' 
    }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    const total = persons.length
    const resString  = `Phonebook has info for ${total} people 
   ${new Date()}` 
    const print = resString.split('\n')
    response.send(print)    
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)
    
    if (note) {
        response.json(note)
    } else {
    response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

    if ((persons.filter(note =>  note.name === body.name )).length !== 0) {
        console.log('onko uniikki', body.name)
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const note = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(note)

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})