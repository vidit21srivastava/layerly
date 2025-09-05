import nodemailer from 'nodemailer';


const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};


export const sendVerificationEmail = async (email, name, token) => {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: {
            name: 'Layerly',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify Your Email - Layerly',
        html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Layerly!</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">3D Printing Made Simple</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hi ${name}!</h2>
                
                <p style="font-size: 16px; margin: 20px 0;">
                    Thank you for signing up with Layerly. To complete your registration and start exploring our amazing 3D printing services, please verify your email address.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; transition: background 0.3s ease;">
                        Verify Email Address
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin: 25px 0;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #667eea; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    ${verificationUrl}
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 14px; color: #666; margin: 20px 0;">
                    <strong>What's next?</strong><br>
                    • Browse our product catalog<br>
                    • Upload custom 3D designs<br>
                    • Get instant quotes<br>
                    • Track your orders
                </p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        This verification link will expire in 24 hours.<br>
                        If you didn't create an account with Layerly, please ignore this email.
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Layerly. All rights reserved.</p>
                <p>Design • Develop • Deliver - one layer at a time</p>
            </div>
        </div>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};


export const sendPasswordResetEmail = async (email, name, token) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: {
            name: 'Layerly',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Reset Your Password - Layerly',
        html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Layerly Account Security</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hi ${name}!</h2>
                
                <p style="font-size: 16px; margin: 20px 0;">
                    We received a request to reset your password for your Layerly account. If you made this request, click the button below to reset your password.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin: 25px 0;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #f5576c; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    ${resetUrl}
                </p>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 25px 0;">
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        <strong>Security Notice:</strong> This password reset link will expire in 1 hour for your security.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        If you didn't request a password reset, please ignore this email.<br>
                        Your password will remain unchanged.
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Layerly. All rights reserved.</p>
                <p>Need help? Contact us at layerly2024@gmail.com</p>
            </div>
        </div>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};


export const sendWelcomeEmail = async (email, name) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: {
            name: 'Layerly Team',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to Layerly! Your account is now active',
        html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Layerly!</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Your 3D printing journey starts here</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hi ${name}!</h2>
                
                <p style="font-size: 16px; margin: 20px 0;">
                    Congratulations! Your email has been successfully verified and your Layerly account is now active. 
                    You're all set to explore our amazing 3D printing services.
                </p>
                
                <div style="background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin: 25px 0; border-radius: 0 5px 5px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #2e7d32;">What you can do now:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #2e7d32;">
                        <li>Browse our product catalog</li>
                        <li>Upload your custom 3D designs</li>
                        <li>Get instant quotes</li>
                        <li>Place orders and track deliveries</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/catalogue" style="background: #4facfe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; margin-right: 10px;">
                        Browse Catalog
                    </a>
                    <a href="${process.env.FRONTEND_URL}/custom" style="background: #00f2fe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Custom Order
                    </a>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 14px; color: #666; margin: 10px 0;">
                        Questions? We're here to help!<br>
                        📧 layerly2024@gmail.com | 📞 +91 96648 51323
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Layerly. All rights reserved.</p>
                <p>Design • Develop • Deliver - one layer at a time</p>
            </div>
        </div>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }
};
