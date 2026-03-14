import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './src/routes/user.routes.js'
import healthRoute from './src/routes/healthcheck.route.js'
import chatRoute from './src/routes/chat.route.js'
import messageRouter from './src/routes/message.route.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/healthcheck', healthRoute)
app.use('/api/v1/chats',chatRoute)
app.use("/api/v1/messages", messageRouter)

export { app }