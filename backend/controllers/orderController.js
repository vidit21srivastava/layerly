import PDFDocument from 'pdfkit';
import axios from 'axios';
import orderModel from '../models/orderModel.js';

// ADMIN: get all orders
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// USER: get user orders
const userOrders = async (req, res) => {
    try {
        const { userID } = req.body;
        const orders = await orderModel.find({ userID }).sort({ date: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN: update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" });
        }
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const COMPANY = {
    gstin: process.env.COMPANY_GSTIN || 'UDYAM-GJ-03-0051710',
    email: process.env.COMPANY_EMAIL || 'layerly2024@gmail.com',
    phone: process.env.COMPANY_PHONE || '+91 96648 51323',
    logoUrl: process.env.COMPANY_LOGO_URL || 'https://res.cloudinary.com/dbbamqxop/image/upload/v1757202949/logo_slogan_nivsi4.png',

};

async function fetchLogoBuffer() {
    // Try absolute URL first
    if (COMPANY.logoUrl && /^https?:\/\//i.test(COMPANY.logoUrl)) {
        try {
            const resp = await axios.get(COMPANY.logoUrl, { responseType: 'arraybuffer', timeout: 8000 });
            return Buffer.from(resp.data);
        } catch { }
    }

    return null;
}

function formatINR(n) {
    const val = Number(n || 0);
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params; // order id
        const userID = req.body.userID; // from userAuth

        // Validate order and permissions
        const order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userID !== userID) return res.status(403).json({ success: false, message: 'Forbidden' });

        // Initialize PDF document with A4 margins
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `Invoice_${order._id}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Calculate content boundaries
        const contentLeft = doc.page.margins.left;
        const contentRight = doc.page.width - doc.page.margins.right;
        const contentWidth = contentRight - contentLeft;

        // === HEADER SECTION ===
        const headerTop = doc.page.margins.top;

        // Logo setup
        const logoBuf = await fetchLogoBuffer();
        let logoBox = { x: contentLeft, y: headerTop, w: 120, h: 50 };
        if (logoBuf) {
            doc.image(logoBuf, logoBox.x, logoBox.y, { fit: [logoBox.w, logoBox.h] });
        }

        // Tagline below logo
        let cursorY = logoBox.y + logoBox.h + 5; // Position below logo with 5px spacing
        doc.fontSize(9)
            .fillColor('#666')
            .text('Design • Develop • Deliver - one layer at a time', contentLeft, cursorY, { width: 260 })
            .moveDown(0.2);
        cursorY = doc.y;

        // Company information block
        const textLeft = logoBuf ? (contentLeft + logoBox.w + 20) : contentLeft;

        doc.fontSize(10)
            .fillColor('#333')
            .text(`${COMPANY.gstin}`, textLeft, headerTop, { width: 260 })
            .text(`Email: ${COMPANY.email}`, textLeft, doc.y, { width: 260 })
            .text(`Phone: ${COMPANY.phone}`, textLeft, doc.y, { width: 260 });

        // Invoice metadata block (right-aligned)
        const metaW = 220;
        const metaX = contentRight - metaW;
        doc.fillColor('#000')
            .fontSize(16)
            .text('Invoice', metaX, headerTop, { width: metaW, align: 'right' })
            .moveDown(0.2)
            .fontSize(10)
            .text(`OrderID: #${order._id.toString().slice(-8)}`, metaX, doc.y, { width: metaW, align: 'right' })
            .text(`Date: ${new Date(order.date).toLocaleString('en-IN')}`, metaX, doc.y, { width: metaW, align: 'right' })
            .text(`PhonePe Txn: ${order.phonePeTxnId || '-'}`, metaX, doc.y, { width: metaW, align: 'right' });

        // Header separator line
        const headerBottom = Math.max(cursorY, doc.y); // Use cursorY (tagline bottom) or company info bottom
        doc.moveTo(contentLeft, headerBottom + 10)
            .lineTo(contentRight, headerBottom + 10)
            .strokeColor('#dddddd')
            .stroke();

        // === BILLING INFORMATION ===
        let y = headerBottom + 24;
        doc.fontSize(12)
            .fillColor('#000')
            .text('Bill To:', contentLeft, y);
        y = doc.y + 4;
        doc.fontSize(10).fillColor('#333');

        const billToName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim()
            || order.address?.email || '';
        if (billToName) doc.text(billToName, contentLeft, y, { width: contentWidth / 2 });
        if (order.address?.email) doc.text(order.address.email);
        if (order.address?.street) doc.text(order.address.street);
        doc.text(`${order.address?.city || ''}${order.address?.city ? ', ' : ''}${order.address?.state || ''} ${order.address?.pinCode || ''}`.trim());
        if (order.address?.phone) doc.text(`Phone: ${order.address.phone}`);
        y = doc.y + 12;

        // === TABLE SETUP ===
        // Define table column positions
        const colItemX = contentLeft;
        const colQtyX = contentLeft + contentWidth * 0.60;
        const colPriceX = contentLeft + contentWidth * 0.75;
        const colTotalX = contentLeft + contentWidth * 0.85;
        const colTotalW = contentRight - colTotalX;

        // Table header drawing function
        const drawTableHeader = () => {
            // Top border
            doc.moveTo(contentLeft, doc.y + 2)
                .lineTo(contentRight, doc.y + 2)
                .strokeColor('#dddddd')
                .stroke();

            // Move down and store header Y position for alignment
            doc.moveDown(0.4);
            const headerY = doc.y;

            // Header text - all on same line using stored Y position
            doc.fontSize(11).fillColor('#000');
            doc.text('Item', colItemX, headerY, { width: colQtyX - colItemX - 10 })
                .text('Qty', colQtyX, headerY, { width: colPriceX - colQtyX - 10, align: 'right' })
                .text('Price', colPriceX, headerY, { width: colTotalX - colPriceX - 10, align: 'right' })
                .text('Total', colTotalX, headerY, { width: colTotalW, align: 'right' });

            // Set Y position below headers
            doc.y = headerY + 15;

            // Bottom border
            doc.moveTo(contentLeft, doc.y + 4)
                .lineTo(contentRight, doc.y + 4)
                .strokeColor('#dddddd')
                .stroke()
                .moveDown(0.6);
        };

        // === ITEMS TABLE ===
        doc.y = y;
        drawTableHeader();

        // Process order items with page break handling
        let subtotal = 0;
        const atBottom = () => doc.y > (doc.page.height - doc.page.margins.bottom - 100);

        for (const it of order.items) {
            if (atBottom()) {
                doc.addPage();
                drawTableHeader();
            }

            const price = Number(it.price || 0);
            const qty = Number(it.quantity || 0);
            const line = price * qty;
            subtotal += line;


            const rowY = doc.y;

            doc.fontSize(10).fillColor('#333');

            doc.text(it.name || it.productId || '-', colItemX, rowY, { width: colQtyX - colItemX - 10 })
                .text(String(qty), colQtyX, rowY, { width: colPriceX - colQtyX - 10, align: 'right' })
                .text(formatINR(price), colPriceX, rowY, { width: colTotalX - colPriceX - 10, align: 'right' })
                .text(formatINR(line), colTotalX, rowY, { width: colTotalW, align: 'right' });


            doc.y = rowY + 15;
        }

        // === TOTALS SECTION ===
        const delivery = Math.max(0, Number(order.amount || 0) - subtotal);
        doc.moveDown(1);

        const totalsW = 200;
        const totalsX = contentRight - totalsW;

        // Total row helper function
        const totalRow = (label, value, opts = {}) => {
            const labelW = totalsW - 80;
            doc.fontSize(opts.bold ? 12 : 10)
                .fillColor('#000')
                .text(label, totalsX, doc.y, { width: labelW, align: 'left' })
                .text(value, totalsX + labelW, doc.y, { width: 80, align: 'right' });
        };

        totalRow('Subtotal:', formatINR(subtotal));
        totalRow('Delivery Fee:', formatINR(delivery));

        // Separator line for grand total
        doc.moveDown(0.3);
        doc.moveTo(totalsX, doc.y)
            .lineTo(totalsX + totalsW, doc.y)
            .strokeColor('#dddddd')
            .stroke();
        doc.moveDown(0.3);

        totalRow('Total:', formatINR(order.amount || 0), { bold: true });

        // === FOOTER ===
        doc.moveDown(2);
        doc.fontSize(9)
            .fillColor('#666')
            .text('Thank you for your purchase!', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Invoice error:', error);
        res.status(500).json({ success: false, message: error.message });
    }


};


export { allOrders, userOrders, updateStatus, downloadInvoice };
