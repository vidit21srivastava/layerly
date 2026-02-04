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

app.set('trust proxy', 1);
app.set('etag', false);

app.disable('etag');

app.use((req, res, next) => {
    res.setHeader('Vary', 'Origin');
    next();
});

// JSON
app.use(express.json());

// CORS
const allowed = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://www.layerly.tech',
    'https://admin.layerly.tech'
];

if (process.env.NODE_ENV !== 'production') {
    allowed.push('http://localhost:5173', 'http://localhost:5174');
}

const allowPreview = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

function isOriginAllowed(origin) {
    try {
        if (!origin) return true;
        if (allowed.filter(Boolean).includes(origin)) return true;
        if (allowPreview && /\.vercel\.app$/.test(new URL(origin).hostname)) {
            return true;
        }
    } catch (e) { }
    return false;
}

app.use(cors({
    origin: (origin, cb) => {
        if (isOriginAllowed(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

let isInitialized = false;
let initPromise = null;

async function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        if (isInitialized) return;

        // DBs
        await connectDB();
        await connectCloudinary();


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

        const sessionSecret = process.env.SESSION_SECRET;
        if (!sessionSecret) {
            throw new Error('SESSION_SECRET is required');
        }

        app.use(session({
            store,
            secret: sessionSecret,
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
        app.get('/health', (req, res) => res.send('OK'));

        // Error handler
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        });

        isInitialized = true;
    })();

    return initPromise;
}

export default async function handler(req, res) {
    try {
        if (req.method === 'OPTIONS') {
            return app(req, res);
        }
        await init();
        return app(req, res);
    } catch (e) {
        console.error('Failed to init server', e);
        const origin = req.headers.origin;
        if (isOriginAllowed(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Vary', 'Origin');
        }
        return res.status(500).json({ success: false, message: 'Server init failed' });
    }
}


