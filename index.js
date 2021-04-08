const express = require('express')
const app = express()

app.use(express.json())

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
    const resString = `Phonebook has info for  ${total} people
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
    notes = persons.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    const 

    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }

    if (persons.filter(note => note.name === body.name)) {
        return response.tatus(400).json({ 
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

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})