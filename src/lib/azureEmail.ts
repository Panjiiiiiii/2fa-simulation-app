import { EmailClient, EmailMessage } from '@azure/communication-email';

// Initialize Azure Communication Email client
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;

if (!connectionString) {
  throw new Error('Azure Communication Services connection string is required');
}

const emailClient = new EmailClient(connectionString);

interface SendEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  plainTextContent,
  from = process.env.AZURE_SENDER_EMAIL || 'noreply@yourdomain.com'
}: SendEmailOptions) {
  try {
    const emailMessage: EmailMessage = {
      senderAddress: from,
      content: {
        subject: subject,
        html: htmlContent,
        plainText: plainTextContent || htmlContent.replace(/<[^>]*>/g, '')
      },
      recipients: {
        to: [{ address: to }]
      }
    };

    const poller = await emailClient.beginSend(emailMessage);
    const result = await poller.pollUntilDone();

    console.log('Email sent successfully:', result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

// Function to create OTP email HTML template
export function createOtpEmailTemplate(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 10px;
            }
            .otp-container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 10px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                margin: 15px 0;
                font-family: monospace;
            }
            .warning {
                background-color: #fef3cd;
                border: 1px solid #faebcc;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 14px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔐 Auth System</div>
                <h1>Verification Code</h1>
                <p>Use this code to complete your authentication</p>
            </div>
            
            <div class="otp-container">
                <h2 style="margin: 0 0 10px 0;">Your OTP Code</h2>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
                    This code expires in 10 minutes
                </p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                    <li>Never share this code with anyone</li>
                    <li>We will never ask for this code via phone or email</li>
                    <li>If you didn't request this code, please ignore this email</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; 2024 Auth System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}