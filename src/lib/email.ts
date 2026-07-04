import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export interface VerificationEmailData {
  adminEmail: string;
  customerName: string;
  partnerName: string;
  transactionId: string;
  verificationLink: string;
}

export interface CustomerActivationEmailData {
  customerEmail: string;
  yourName: string;
  partnerName: string;
  proposalLink: string;
}

export async function sendVerificationEmail(data: VerificationEmailData) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">🎁 New Proposal Payment</h1>
      </div>
      
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Verification Required</h2>
        <p style="color: #666; font-size: 16px;">
          A new proposal has been submitted and requires your verification to activate.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <p style="margin: 5px 0;"><strong>From:</strong> ${data.customerName}</p>
          <p style="margin: 5px 0;"><strong>To:</strong> ${data.partnerName}</p>
          <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> ₹99 (Premium Plan)</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
          Click the button below to verify and activate this proposal link:
        </p>
        
        <a href="${data.verificationLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
          ✓ Verify & Activate
        </a>
        
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          This link will expire in 24 hours.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          Purpose Site Admin Panel<br/>
          © 2026 All rights reserved
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.adminEmail,
      subject: `🎁 New Proposal Verification - ${data.customerName} & ${data.partnerName}`,
      html: htmlContent,
    });
    console.log('✅ Verification email sent to admin');
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
}

export async function sendCustomerActivationEmail(data: CustomerActivationEmailData) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">💝 Your Proposal is Live!</h1>
      </div>
      
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Congratulations, ${data.yourName}! 🎉</h2>
        <p style="color: #666; font-size: 16px;">
          Your proposal for <strong>${data.partnerName}</strong> has been verified and is now live!
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
          <p style="color: #999; font-size: 12px; margin-bottom: 10px; text-transform: uppercase;">Your Proposal Link</p>
          <a href="${data.proposalLink}" style="color: #f5576c; font-size: 14px; font-weight: bold; text-decoration: none; word-break: break-all;">
            ${data.proposalLink}
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
          <strong>Important:</strong> Your link will be valid for 2 views within 30 days. Make sure to share it with ${data.partnerName}!
        </p>
        
        <a href="${data.proposalLink}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; width: 200px; text-align: center;">
          👀 View Your Proposal
        </a>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          Purpose Site | Making Proposals Special<br/>
          © 2026 All rights reserved
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.customerEmail,
      subject: `💝 Your Proposal for ${data.partnerName} is Live!`,
      html: htmlContent,
    });
    console.log('✅ Activation email sent to customer');
  } catch (error) {
    console.error('❌ Failed to send activation email:', error);
    throw error;
  }
}

export async function sendCustomRequestEmail(
  adminEmail: string,
  customerName: string,
  customerEmail: string,
  description: string,
  budget?: number
) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">✨ New Custom Request</h1>
      </div>
      
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Custom Template Request</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Budget:</strong> ${budget ? `₹${budget}` : 'Not specified'}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
          <p><strong>Request Details:</strong></p>
          <p style="color: #666; white-space: pre-wrap;">${description}</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: adminEmail,
      subject: `✨ New Custom Template Request - ${customerName}`,
      html: htmlContent,
    });
    console.log('✅ Custom request email sent to admin');
  } catch (error) {
    console.error('❌ Failed to send custom request email:', error);
    throw error;
  }
}
