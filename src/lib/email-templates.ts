export const EmailTemplates = {
    bookingConfirmation: (booking: any, user: any) => `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Your Appointment is Confirmed!</h1>
        <p>Hi ${user.name},</p>
        <p>Your appointment at <strong>${booking.salon.name}</strong> has been confirmed.</p>

        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${booking.service.name}</p>
          <p><strong>Date:</strong> ${new Date(booking.startTime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(booking.startTime).toLocaleTimeString()}</p>
          <p><strong>Location:</strong> ${booking.salon.address}, ${booking.salon.city}</p>
        </div>

        <p>Need to reschedule? You can do so from your bookings page.</p>
        <p>See you soon!</p>
        <p>The Priisme Team</p>
      </div>
    `,

    bookingCancellation: (booking: any, user: any) => `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Appointment Cancelled</h1>
        <p>Hi ${user.name},</p>
        <p>Your appointment at <strong>${booking.salon.name}</strong> scheduled for ${new Date(booking.startTime).toLocaleString()} has been cancelled.</p>

        <p>If this was a mistake, please book a new appointment or contact the salon directly.</p>
        <p>The Priisme Team</p>
      </div>
    `,

    orderConfirmation: (order: any, user: any) => `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Order Confirmation</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for your order! We've received your request.</p>

        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total:</strong> ${(order.totalAmount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
        </div>

        <h3>Items:</h3>
        <ul>
            ${order.items.map((item: any) => `
                <li>${item.product.name} (x${item.quantity}) - ${(item.priceAtPurchase / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</li>
            `).join('')}
        </ul>

        <p>We'll notify you when your items are ready for pickup or shipped.</p>
        <p>The Priisme Team</p>
      </div>
    `
};
