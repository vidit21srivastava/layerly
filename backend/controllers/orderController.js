import PDFDocument from "pdfkit";
import axios from "axios";
import orderModel from "../models/orderModel.js";

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
            return res
                .status(400)
                .json({ success: false, message: "Order ID and status are required" });
        }
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true },
        );
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
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
    gstin: process.env.COMPANY_GSTIN || "UDYAM-GJ-03-0051710",
    email: process.env.COMPANY_EMAIL || "layerly2024@gmail.com",
    phone: process.env.COMPANY_PHONE || "+91 96648 51323",
    logoUrl:
        process.env.COMPANY_LOGO_URL ||
        "https://res.cloudinary.com/dbbamqxop/image/upload/v1757202949/logo_slogan_nivsi4.png",
};

async function fetchLogoBuffer() {
    if (COMPANY.logoUrl && /^https?:\/\//i.test(COMPANY.logoUrl)) {
        try {
            const resp = await axios.get(COMPANY.logoUrl, {
                responseType: "arraybuffer",
                timeout: 8000,
            });
            return Buffer.from(resp.data);
        } catch { }
    }

    return null;
}

function formatINR(n) {
    const val = Number(n || 0);
    return `Rs. ${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.body.userID;

        const order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userID !== userID) return res.status(403).json({ success: false, message: 'Forbidden' });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `Invoice_${order._id}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);


        const contentLeft = doc.page.margins.left;
        const contentRight = doc.page.width - doc.page.margins.right;
        const contentWidth = contentRight - contentLeft;

        // HEADER SECTION 
        const headerTop = doc.page.margins.top;

        // Logo
        const logoBuf = await fetchLogoBuffer();
        let logoBox = { x: contentLeft, y: headerTop, w: 120, h: 50 };
        if (logoBuf) {
            doc.image(logoBuf, logoBox.x, logoBox.y, { fit: [logoBox.w, logoBox.h] });
        }


        let cursorY = logoBox.y + logoBox.h * 0.6;
        doc.fontSize(9)
            .fillColor('#666')
            .text(
                'Design • Develop • Deliver - one layer at a time',
                contentLeft,
                cursorY,
                { width: 260, lineGap: 0 }
            );
        cursorY = doc.y;


        /*
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
        */


        // Company information block 
        const infoY = cursorY + 10;
        doc.fontSize(10)
            .fillColor('#333')
            .text(`${COMPANY.gstin}`, contentLeft, infoY, { width: 260 })
            .text(`Email: ${COMPANY.email}`, contentLeft, doc.y, { width: 260 })
            .text(`Phone: ${COMPANY.phone}`, contentLeft, doc.y, { width: 260 });


        const metaW = 220;
        const metaX = contentRight - metaW;
        doc.fillColor('#000')
            .fontSize(16)
            .text('Invoice', metaX, headerTop, { width: metaW, align: 'right' });


        doc.fontSize(10)
            .fillColor('#000')
            .text(`OrderID: #${order._id.toString().slice(-8)}`, metaX, infoY, { width: metaW, align: 'right' })
            .text(`Date: ${new Date(order.date).toLocaleString('en-IN')}`, metaX, doc.y, { width: metaW, align: 'right' })
            .text(`PhonePe Txn: ${order.phonePeTxnId || '-'}`, metaX, doc.y, { width: metaW, align: 'right' });


        const headerBottom = Math.max(cursorY, doc.y);
        doc.moveTo(contentLeft, headerBottom + 10)
            .lineTo(contentRight, headerBottom + 10)
            .strokeColor('#dddddd')
            .stroke();

        // BILLING INFORMATION 
        let y = headerBottom + 24;
        doc.fontSize(12)
            .fillColor('#000')
            .text('Billing Information:', contentLeft, y);
        y = doc.y + 4;
        doc.fontSize(10).fillColor('#333');

        const billToName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim()
            || order.address?.email || '';
        if (billToName) doc.text(billToName, contentLeft, y, { width: contentWidth / 2 });
        if (order.address?.email) doc.text(order.address.email);
        if (order.address?.street) doc.text(order.address.street);
        doc.text(`${order.address?.city || ''}${order.address?.city ? ', ' : ''}${order.address?.state || ''} ${order.address?.pinCode || ''}`.trim());
        if (order.address?.phone) doc.text(`Phone: ${order.address.phone}`);
        y = doc.y + 20;

        // TABLE SETUP 

        const colItemX = contentLeft;
        const colQtyX = contentLeft + contentWidth * 0.55;
        const colPriceX = contentLeft + contentWidth * 0.68;
        const colTotalX = contentLeft + contentWidth * 0.82;
        const colTotalW = contentRight - colTotalX;


        const drawTableHeader = () => {

            doc.moveTo(contentLeft, doc.y + 2)
                .lineTo(contentRight, doc.y + 2)
                .strokeColor('#333')
                .lineWidth(1)
                .stroke();

            doc.moveDown(0.4);
            const headerY = doc.y;


            doc.font('Helvetica-Bold')
                .fontSize(11)
                .fillColor('#000');

            doc.text('Item', colItemX, headerY, { width: colQtyX - colItemX - 10 })
                .text('Qty', colQtyX, headerY, { width: colPriceX - colQtyX - 10, align: 'center' })
                .text('Price', colPriceX, headerY, { width: colTotalX - colPriceX - 10, align: 'center' })
                .text('Total', colTotalX, headerY, { width: colTotalW, align: 'right' });


            doc.y = headerY + 12;


            doc.moveTo(contentLeft, doc.y)
                .lineTo(contentRight, doc.y)
                .strokeColor('#333')
                .lineWidth(1)
                .stroke();

            doc.moveDown(0.6);
        };

        // ITEMS TABLE 
        doc.y = y;


        const items = Array.isArray(order.items) ? order.items : [];
        console.log('Order items:', items);
        console.log('Order amount:', order.amount);

        if (items.length === 0) {
            doc.fontSize(10)
                .fillColor('#666')
                .text('No items found in this order.', contentLeft, doc.y);
            doc.moveDown(2);
        } else {
            drawTableHeader();


            let subtotal = 0;
            const atBottom = () => doc.y > (doc.page.height - doc.page.margins.bottom - 120);

            for (const it of items) {
                if (atBottom()) {
                    doc.addPage();
                    drawTableHeader();
                }

                const price = Number(it.price || 0);
                const qty = Number(it.quantity || 0);
                const lineTotal = price * qty;
                subtotal += lineTotal;

                const rowY = doc.y;


                doc.font('Helvetica')
                    .fontSize(10)
                    .fillColor('#333');


                doc.text(it.name || it.productId || '-', colItemX, rowY, {
                    width: colQtyX - colItemX - 10,
                    ellipsis: true
                });

                doc.text(String(qty), colQtyX, rowY, {
                    width: colPriceX - colQtyX - 10,
                    align: 'center'
                });

                doc.text(formatINR(price), colPriceX, rowY, {
                    width: colTotalX - colPriceX - 10,
                    align: 'center'
                });

                doc.text(formatINR(lineTotal), colTotalX, rowY, {
                    width: colTotalW,
                    align: 'right'
                });

                doc.y = rowY + 18;


                doc.moveTo(contentLeft, doc.y - 2)
                    .lineTo(contentRight, doc.y - 2)
                    .strokeColor('#eeeeee')
                    .lineWidth(0.5)
                    .stroke();
            }


            doc.moveTo(contentLeft, doc.y + 2)
                .lineTo(contentRight, doc.y + 2)
                .strokeColor('#333')
                .lineWidth(1)
                .stroke();

            // TOTALS SECTION 
            const delivery = Math.max(0, Number(order.amount || 0) - subtotal);
            doc.moveDown(1.5);

            const totalsW = 200;
            const totalsX = contentRight - totalsW;


            const totalRow = (label, value, isBold = false) => {
                const labelW = totalsW - 80;
                const currentY = doc.y;

                doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
                    .fontSize(isBold ? 12 : 10)
                    .fillColor('#000');

                doc.text(label, totalsX, currentY, { width: labelW, align: 'left' });
                doc.text(value, totalsX + labelW, currentY, { width: 80, align: 'right' });

                doc.y = currentY + (isBold ? 20 : 16);
            };

            totalRow('Subtotal:', formatINR(subtotal));
            totalRow('Delivery Fee:', formatINR(delivery));


            doc.moveTo(totalsX, doc.y - 5)
                .lineTo(totalsX + totalsW, doc.y - 5)
                .strokeColor('#333')
                .lineWidth(1)
                .stroke();

            doc.moveDown(0.3);
            totalRow('Total:', formatINR(order.amount || 0), true);
        }

        // FOOTER 
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
