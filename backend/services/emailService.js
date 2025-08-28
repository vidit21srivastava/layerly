import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Generate OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, userName) => {
    const mailOptions = {
        from: {
            name: 'Layerly',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify Your Email - Layerly',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #ffa800; margin: 0;">Layerly</h1>
                    <p style="color: #666; margin: 10px 0;">Design, Develop, Deliver</p>
                </div>
                
                <div style="padding: 30px; background-color: white;">
                    <h2 style="color: #333;">Hello ${userName}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Thank you for registering with Layerly. Please use the following OTP to verify your email address:
                    </p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h1 style="color: #ffa800; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6;">
                        This OTP is valid for 10 minutes. If you didn't request this verification, please ignore this email.
                    </p>
                </div>
                
                <div style="background-color: #383838; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Layerly. All rights reserved.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, userName) => {
    const mailOptions = {
        from: {
            name: 'Layerly',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to Layerly!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #ffa800; margin: 0;">Welcome to Layerly!</h1>
                </div>
                
                <div style="padding: 30px; background-color: white;">
                    <h2 style="color: #333;">Hello ${userName}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Your email has been successfully verified. You're now part of the Layerly community!
                    </p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Explore our catalogue of pre-designed 3D printed accessories or upload your custom designs.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/catalogue" 
                           style="background-color: #ffa800; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Start Shopping
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #383838; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Layerly. All rights reserved.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Welcome email error:', error);
    }
};
