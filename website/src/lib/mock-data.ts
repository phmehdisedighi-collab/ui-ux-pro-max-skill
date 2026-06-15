export const MOCK_SERVICES = [
  {
    id: 'session-30',
    name_fa: 'جلسه ۳۰ دقیقه‌ای',
    name_en: '30-Minute Session',
    description_fa: 'بررسی سریع استراتژی یا پرسش‌وپاسخ تخصصی',
    description_en: 'Quick strategy review or focused Q&A',
    duration_minutes: 30,
    price: 990000,
  },
  {
    id: 'session-60',
    name_fa: 'جلسه ۶۰ دقیقه‌ای',
    name_en: '60-Minute Session',
    description_fa: 'مشاوره عمیق و برنامه‌ریزی نقشه راه',
    description_en: 'Deep-dive consultation and roadmap planning',
    duration_minutes: 60,
    price: 1790000,
  },
]

export const MOCK_BOOKINGS = [
  {
    id: 'bk-1',
    service: { name_fa: 'جلسه ۶۰ دقیقه‌ای', name_en: '60-Minute Session' },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    time: '10:00',
    platform: 'google_meet',
    status: 'confirmed',
    meeting_link: 'https://meet.google.com/placeholder',
  },
  {
    id: 'bk-2',
    service: { name_fa: 'جلسه ۳۰ دقیقه‌ای', name_en: '30-Minute Session' },
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    time: '14:00',
    platform: 'zoom',
    status: 'completed',
    meeting_link: null,
  },
]
