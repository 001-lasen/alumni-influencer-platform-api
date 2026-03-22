module.exports = function verifyEmailOTPTemplate(otp) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table width="480" cellpadding="0" cellspacing="0" 
                        style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color:#1a1a2e; padding:24px 32px;">
                                <h1 style="margin:0; color:#ffffff; font-size:20px;">
                                    Eastminster Alumni
                                </h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:32px;">
                                <h2 style="margin:0 0 12px; color:#1a1a2e; font-size:22px;">
                                    Verify your email address
                                </h2>
                                <p style="color:#555; line-height:1.6;">
                                    Use the OTP below to complete your registration. 
                                    This code expires in <strong>10 minutes</strong>.
                                </p>

                                <!-- OTP Box -->
                                <div style="
                                    margin: 28px 0;
                                    padding: 20px;
                                    background: #f0f4ff;
                                    border-radius: 8px;
                                    text-align: center;
                                    letter-spacing: 12px;
                                    font-size: 36px;
                                    font-weight: bold;
                                    color: #1a1a2e;
                                ">
                                    ${otp}
                                </div>

                                <p style="color:#555; line-height:1.6;">
                                    If you did not create an account, please ignore this email.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background:#f9f9f9; padding:16px 32px; border-top:1px solid #eee;">
                                <p style="margin:0; color:#aaa; font-size:12px;">
                                    © 2026 Eastminster Alumni Platform. Do not reply to this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};
