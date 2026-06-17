export type Locale = 'fa' | 'en';

export type Package = {
  id: string;
  slug: string;
  title_fa: string;
  title_en: string;
  description_fa: string | null;
  description_en: string | null;
  duration_min: number;
  sessions_count: number;
  price_toman: number;
  is_active: boolean;
  sort_order: number;
};

export type Slot = {
  id: string;
  start_at: string;
  end_at: string;
  status: 'open' | 'held' | 'booked';
  held_until: string | null;
};

export type BookingStatus = 'pending' | 'paid' | 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  user_id: string;
  package_id: string;
  slot_id: string | null;
  meeting_type: string;
  status: BookingStatus;
  amount_toman: number;
  gcal_event_id: string | null;
  meet_link: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
};
