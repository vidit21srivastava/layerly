import { v2 as cloudinary } from 'cloudinary';
import CustomQuote from '../models/customQuoteModel.js';
import userModel from '../models/userModel.js';
import { sendCustomQuoteReplyEmail } from '../config/email.js';

// Create a new custom quote with STL upload to Cloudinary
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
            instructions
        } = req.body || {};

        if (!name || !email || !material || !layerHeight || infill === undefined || !infillPattern || !color) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'STL file is required' });
        }

        // Upload STL to Cloudinary as raw resource
        const uploadRes = await cloudinary.uploader.upload(req.file.path, {
            folder: 'custom-models',
            resource_type: 'raw',
            use_filename: true,
            unique_filename: true,
            allowed_formats: ['stl']
        });

        const doc = await CustomQuote.create({
            userID: req.body.userID || null, // filled by userAuth if token is present
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
            fileUrl: uploadRes.secure_url,
            filePublicId: uploadRes.public_id,
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

// Admin: list all quotes
const listCustomQuotes = async (req, res) => {
    try {
        const quotes = await CustomQuote.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, quotes });
    } catch (err) {
        console.error('listCustomQuotes error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Admin: reply to a quote (send email with remark & stl link)
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

export { closeCustomQuote, replyToCustomQuote, listCustomQuotes, createCustomQuote };
