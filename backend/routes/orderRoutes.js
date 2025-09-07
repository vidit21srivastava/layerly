import express from "express";
import { allOrders, userOrders, updateStatus, downloadInvoice } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.get("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// User Features
orderRouter.get("/userorders", userAuth, userOrders);

// Invoice (User)
orderRouter.get("/invoice/:id", userAuth, downloadInvoice);

export default orderRouter;
