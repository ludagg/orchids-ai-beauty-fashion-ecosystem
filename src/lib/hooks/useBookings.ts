import { useQuery } from '@tanstack/react-query';

export interface Booking {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  staffId?: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
  salon?: {
    id: string;
    name: string;
    address?: string;
    image?: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff?: {
    id: string;
    name: string;
    image?: string;
  };
}

const fetchBookings = async (): Promise<Booking[]> => {
  const res = await fetch('/api/bookings');
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
};

const fetchBooking = async (id: string): Promise<Booking> => {
  const res = await fetch(`/api/bookings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
};

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBooking(id),
    enabled: !!id,
  });
}
