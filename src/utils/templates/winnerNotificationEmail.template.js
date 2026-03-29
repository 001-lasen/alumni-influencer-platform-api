module.exports = function winnerNotificationEmailTemplate(firstName, slotDate) {
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
                                    Congratulations, ${firstName}!!!
                                </h2>
                                <p style="color:#555; line-height:1.6;">
                                    You have been selected as the <strong>Alumni of the Day</strong> 
                                    for <strong>${slotDate}</strong>. Your profile will be exclusively 
                                    featured on the platform and visible to all students for the entire day.
                                </p>

                                <!-- Winner Badge -->
                                <div style="
                                    margin: 28px 0;
                                    padding: 20px;
                                    background: #f0fff4;
                                    border-radius: 8px;
                                    text-align: center;
                                    border: 2px solid #38a169;
                                ">
                                    <p style="margin:0 0 8px; color:#276749; font-size:14px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;">
                                        Alumni of the Day
                                    </p>
                                    <p style="margin:0; color:#1a1a2e; font-size:28px; font-weight:bold;">
                                        ${slotDate}
                                    </p>
                                </div>

                                <p style="color:#555; line-height:1.6;">
                                    Make sure your profile is up to date so students can learn about 
                                    your career journey and connect with you on LinkedIn.
                                </p>

                                <!-- Info Box -->
                                <div style="
                                    margin: 20px 0 0;
                                    padding: 16px;
                                    background: #ebf8ff;
                                    border-left: 4px solid #3182ce;
                                    border-radius: 4px;
                                ">
                                    <p style="margin:0; color:#2b6cb0; font-size:14px; line-height:1.6;">
                                        <strong>What happens next?</strong> Your profile will go live at 
                                        midnight and remain featured for 24 hours. Students will be able 
                                        to view your qualifications, career history, and connect with you 
                                        via LinkedIn.
                                    </p>
                                </div>
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
