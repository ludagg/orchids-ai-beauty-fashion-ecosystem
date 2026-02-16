interface EmailTemplateProps {
    userName: string;
    actionUrl?: string;
    [key: string]: any;
}

export const EmailTemplates = {
    bookingConfirmation: (booking: any, user: any) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #333;">Booking Confirmed!</h2>
            <p>Hi ${user.name},</p>
            <p>Your appointment at <strong>${booking.salon.name}</strong> has been confirmed.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Service:</strong> ${booking.service.name}</p>
                <p><strong>Date:</strong> ${new Date(booking.startTime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${new Date(booking.startTime).toLocaleTimeString()}</p>
                <p><strong>Price:</strong> ${(booking.totalPrice / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
            </div>
            <p>You can manage your booking in the app.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/bookings" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">View Booking</a>
        </div>
    `,

    bookingCancellation: (booking: any, user: any) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #e11d48;">Booking Cancelled</h2>
            <p>Hi ${user.name},</p>
            <p>Your appointment at <strong>${booking.salon.name}</strong> has been cancelled.</p>
            <p>If this was a mistake, please book again or contact the salon.</p>
             <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/salons/${booking.salon.id}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Book Again</a>
        </div>
    `,

    orderConfirmation: (order: any, user: any) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #333;">Order Received!</h2>
            <p>Hi ${user.name},</p>
            <p>Thanks for your order #${order.id}. We're getting it ready!</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                ${order.items.map((item: any) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>${item.product.name} (x${item.quantity})</span>
                        <span>${(item.priceAtPurchase / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                    </div>
                `).join('')}
                <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 10px 0;" />
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>Total</span>
                    <span>${(order.totalAmount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/bookings" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Track Order</a>
        </div>
    `
};
