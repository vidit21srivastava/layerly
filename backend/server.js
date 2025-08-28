import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudiary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'

const app = express()
const port = process.env.PORT || 4000


connectDB()
connectCloudiary()


app.use(express.json())
app.use(cors())
// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)



app.get('/', (req, res) => {
    res.send("API Working")
})


app.listen(port, () => console.log('Server started on PORT :' + port))