import CustomQuote from '../models/customQuoteModel.js';
import userModel from '../models/userModel.js';
import { sendCustomQuoteReplyEmail } from '../config/email.js';
import axios from 'axios';

const createCustomQuote = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            material,
            layerHeight,
            infill,
            infillPattern,
            supports,
            brim,
            raft,
            color,
            instructions,
            fileUrl,
        } = req.body || {};


        if (!name || !email || !material || !layerHeight || infill === undefined || !infillPattern || !color) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        if (!fileUrl || typeof fileUrl !== 'string') {
            return res.status(400).json({ success: false, message: 'Google Drive public link (fileUrl) is required' });
        }

        const doc = await CustomQuote.create({
            userID: req.body.userID || null,
            name,
            email,
            phone: phone || null,
            material,
            layerHeight,
            infill: Number(infill),
            infillPattern,
            supports: supports === 'true' || supports === true,
            brim: brim === 'true' || brim === true,
            raft: raft === 'true' || raft === true,
            color,
            instructions: instructions || '',
            fileUrl, // store the original link as given
            status: 'PENDING'
        });

        return res.status(201).json({
            success: true,
            message: 'Custom quote submitted successfully',
            quote: doc
        });
    } catch (err) {
        console.error('createCustomQuote error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


const listCustomQuotes = async (req, res) => {
    try {
        const quotes = await CustomQuote.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, quotes });
    } catch (err) {
        console.error('listCustomQuotes error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const replyToCustomQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { remark, price } = req.body;

        const quote = await CustomQuote.findById(id);
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }

        quote.adminRemark = remark || '';
        if (price !== undefined && price !== null && !isNaN(price)) {
            quote.price = Number(price);
        }
        quote.status = 'REPLIED';
        await quote.save();


        let name = quote.name;
        if (quote.userID) {
            try {
                const user = await userModel.findById(quote.userID);
                if (user?.name) name = user.name;
            } catch { }
        }

        await sendCustomQuoteReplyEmail({
            to: quote.email,
            name,
            remark: quote.adminRemark,
            price: quote.price,
            stlUrl: quote.fileUrl
        });

        return res.status(200).json({ success: true, message: 'Reply sent successfully', quote });
    } catch (err) {
        console.error('replyToCustomQuote error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const closeCustomQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await CustomQuote.findByIdAndUpdate(
            id,
            { status: 'CLOSED' },
            { new: true }
        );
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        return res.status(200).json({ success: true, quote });
    } catch (err) {
        console.error('closeCustomQuote error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

function normalizeDriveUrl(src) {
    try {
        const u = new URL(src);

        if (u.hostname === 'drive.google.com') {
            const match = u.pathname.match(/\/file\/d\/([^/]+)/i);
            if (match && match[1]) {
                return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }

            if (u.pathname.startsWith('/uc')) return u.toString();
        }
        return src;
    } catch {
        return src;
    }
}

const ALLOWED_HOSTS = new Set([
    'drive.google.com',
    'googleusercontent.com',
    'lh3.googleusercontent.com',
]);

const proxyStl = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: 'Missing url' });

        const direct = normalizeDriveUrl(url);
        let parsed;
        try {
            parsed = new URL(direct);
        } catch {
            return res.status(400).json({ success: false, message: 'Invalid url' });
        }
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return res.status(400).json({ success: false, message: 'Invalid protocol' });
        }


        const hostOk = [...ALLOWED_HOSTS].some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`));
        if (!hostOk) {
            return res.status(403).json({ success: false, message: 'Host not allowed' });
        }

        const upstream = await axios.get(parsed.toString(), {
            responseType: 'stream',
            headers: { 'User-Agent': 'Layerly-STL-Proxy' },
            maxRedirects: 5,
        });

        res.set('Content-Type', upstream.headers['content-type'] || 'model/stl');
        res.set('Cache-Control', 'public, max-age=3600');
        upstream.data.pipe(res);
    } catch (err) {
        console.error('proxyStl error:', err.message);
        res.status(502).json({ success: false, message: 'Failed to fetch STL' });
    }
};




export { closeCustomQuote, replyToCustomQuote, listCustomQuotes, createCustomQuote, proxyStl };

