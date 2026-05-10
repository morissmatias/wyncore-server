import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export const sendOrderConfirmationEmail = async (customer, order, invoice) => {
  await transporter.sendMail({
    from: `"WynCore - Wyn Power Corporation" <${process.env.MAIL_USER}>`,
    to: customer.email,
    subject: `Order Received - ${invoice.invoiceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a3a5c; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">WynCore</h1>
          <p style="color: #93c5fd; margin: 5px 0;">Wyn Power Corporation</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1a3a5c;">Order Received</h2>
          <p>Dear <strong>${customer.name}</strong>,</p>
          <p>Thank you for your order. We have received it and it is currently being reviewed by our team.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
            <p><strong>Total Amount:</strong> ₱${Number(invoice.totalAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
            <p><strong>Status:</strong> Pending Review</p>
          </div>
          <p>You will receive another email once your order has been reviewed.</p>
          <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact us directly.</p>
        </div>
        <div style="background-color: #1a3a5c; padding: 15px; text-align: center;">
          <p style="color: #93c5fd; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Wyn Power Corporation. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

export const sendOrderStatusEmail = async (customer, order, invoice, status, remarks) => {
  const isApproved = status === 'APPROVED'
  const statusColor = isApproved ? '#16a34a' : '#dc2626'
  const statusText = isApproved ? 'Approved' : 'Rejected'

  await transporter.sendMail({
    from: `"WynCore - Wyn Power Corporation" <${process.env.MAIL_USER}>`,
    to: customer.email,
    subject: `Order ${statusText} - ${invoice.invoiceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a3a5c; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">WynCore</h1>
          <p style="color: #93c5fd; margin: 5px 0;">Wyn Power Corporation</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1a3a5c;">Order Update</h2>
          <p>Dear <strong>${customer.name}</strong>,</p>
          <p>Your order has been reviewed and the status has been updated.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Total Amount:</strong> ₱${Number(invoice.totalAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
            <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
            ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
          </div>
          ${isApproved
            ? '<p>Your order has been confirmed and will be processed for delivery. Our team will contact you shortly.</p>'
            : '<p>Unfortunately your order has been rejected. Please contact us for more information.</p>'
          }
          <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact us directly.</p>
        </div>
        <div style="background-color: #1a3a5c; padding: 15px; text-align: center;">
          <p style="color: #93c5fd; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Wyn Power Corporation. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}