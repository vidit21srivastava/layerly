import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import passport from './config/passport.js';
import paymentRouter from './routes/paymentRoutes.js';
import customRouter from './routes/customRoutes.js';

const app = express();
const port = process.env.PORT || 4000;


app.set('trust proxy', 1);

// DB
connectDB();
connectCloudinary();

// JSON/CORS
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));

// Redis client 
const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis error:', err));

await redisClient.connect();

const store = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
});


app.use(session({
    store,
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'layerly-session-secret',
    resave: false,
    saveUninitialized: false,
    name: 'layerly.sid',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    },
}));


// app.use(session({
//     secret: process.env.JWT_SECRET || 'layerly-session-secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 24 * 60 * 60 * 1000
//     }
// }));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/custom', customRouter);

app.get('/', (req, res) => res.send('API Working'));

// Errors
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port, () => console.log('Server started on PORT :' + port));