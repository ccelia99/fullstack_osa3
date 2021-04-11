const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
  
const morgan = require('morgan')
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
    .catch(error => {
        next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const note = new Note({
        name: body.name,
        number: body.number
    })
   
    note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
        response.json(savedAndFormattedNote)
      }) 
    .catch(error => {
        next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
        }
    })
    .catch(error => {
        next(error)
    })       
})

app.get('/info', (request, response, next) => {
    
    Note.find().exec(function (err, results) {
        const total = results.length
        console.log('note', total)
        const resString  = `Phonebook has info for ${total} people 
        ${new Date()}` 
        const print = resString.split('\n')
        response.send(print) 
    })
    .catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      name: body.name,
      number: body.number,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => {
        next(error)
    })
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})