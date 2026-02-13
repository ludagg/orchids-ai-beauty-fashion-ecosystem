export const chats = [
  {
    id: 1,
    name: "Studio Épure",
    avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
    lastMessage: "Your order has been shipped! 📦",
    time: "10:30 AM",
    unread: 2,
    online: true,
    type: "Business"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "I loved the minimalist dress you picked!",
    time: "Yesterday",
    unread: 0,
    online: false,
    type: "Creator"
  },
  {
    id: 3,
    name: "Aura Luxury Spa",
    avatar: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=100&h=100&fit=crop",
    lastMessage: "Confirming your appointment for Sunday.",
    time: "Tue",
    unread: 0,
    online: true,
    type: "Salon"
  }
];

export const initialMessages = [
  { id: 1, text: "Hi! I had a question about the Summer Minimalist Dress.", sender: "me", time: "10:00 AM", status: "read" },
  { id: 2, text: "Hello! We'd be happy to help. What would you like to know?", sender: "them", time: "10:05 AM", status: "read" },
  { id: 3, text: "Is the fabric stretchable?", sender: "me", time: "10:10 AM", status: "read" },
  { id: 4, text: "It's 100% organic cotton, so it has a natural give but isn't highly stretchable. It's designed for a relaxed fit though!", sender: "them", time: "10:15 AM", status: "read" },
  { id: 5, text: "Your order has been shipped! 📦", sender: "them", time: "10:30 AM", status: "sent" },
];
