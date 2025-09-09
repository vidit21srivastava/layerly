import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
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

// DBs
connectDB();
connectCloudinary();

// JSON/CORS
app.use(express.json());

const allowed = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://www.layerly.tech'
];

if (process.env.NODE_ENV !== 'production') {
    allowed.push('http://localhost:5173', 'http://localhost:5174');
}

const allowPreview = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

app.use(cors({
    origin: (origin, cb) => {
        try {
            if (!origin) return cb(null, true); // mobile apps/cURL
            if (allowed.filter(Boolean).includes(origin)) return cb(null, true);
            if (allowPreview && /\.vercel\.app$/.test(new URL(origin).hostname)) {
                return cb(null, true);
            }
        } catch (e) {

        }
        return cb(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));


async function start() {
    const redisClient = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });

    redisClient.on('error', (err) => console.error('Redis error:', err));
    await redisClient.connect();
    console.log('Redis connected successfully');

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
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        },
    }));

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

    // Error handler
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });

    app.listen(port, () => console.log('Server started on PORT :' + port));
}

start().catch((e) => {
    console.error('Failed to start server', e);
    process.exit(1);
});


