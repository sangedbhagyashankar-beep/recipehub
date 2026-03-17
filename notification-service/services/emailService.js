const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/notificationConfig');

const transporter = nodemailer.createTransport(emailConfig);

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"RecipeHub" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

const sendOrderConfirmation = async (email, orderDetails) => {
  return sendEmail({
    to: email,
    subject: `Order Confirmed - ${orderDetails.recipeTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Order Confirmed!</h2>
        <p>Your ingredient kit for <strong>${orderDetails.recipeTitle}</strong> has been confirmed.</p>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
        <p><strong>Total:</strong> $${orderDetails.totalPrice}</p>
        <p>Thank you for ordering from RecipeHub!</p>
      </div>
    `
  });
};

const sendWelcomeEmail = async (email, name) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to RecipeHub!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Welcome to RecipeHub, ${name}!</h2>
        <p>We're excited to have you join our community of food lovers.</p>
        <p>Start exploring recipes, sharing your own, and ordering ingredient kits!</p>
      </div>
    `
  });
};

module.exports = { sendEmail, sendOrderConfirmation, sendWelcomeEmail };
