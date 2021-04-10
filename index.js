const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

   /* if ((persons.filter(note =>  note.name === body.name )).length !== 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }*/

    const note = new Note({
        name: body.name,
        number: body.number,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.get('/info', (request, response) => {
    const total = persons.length
    const resString  = `Phonebook has info for ${total} people 
   ${new Date()}` 
    const print = resString.split('\n')
    response.send(print)    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})