require('dotenv').config()

const express = require('express')
const http = require('http')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes/index')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const initSocket = require('./socket')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")))
app.use(fileUpload({}))

// ❗ создаём HTTP сервер
const server = http.createServer(app)

// ❗ инициализируем socket
const io = initSocket(server)

// прокидываем io в req
app.use((req, res, next) => {
    req.io = io
    next()
})

app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()


        server.listen(PORT, () =>
            console.log(`Server started on port ${PORT}`)
        )
    } catch (e) {
        console.log(e)
    }
}

start()
