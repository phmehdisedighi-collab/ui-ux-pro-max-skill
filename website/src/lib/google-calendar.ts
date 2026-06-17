import { google } from 'googleapis';

/**
 * ساخت رویداد Google Calendar + لینک Google Meet.
 * از یک Service Account با Domain-Wide Delegation یا یک Refresh Token استفاده می‌کند.
 *
 * متغیرهای محیطی پشتیبانی‌شده (یکی از دو روش):
 *  روش OAuth:  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 *  روش SA:     GOOGLE_SA_EMAIL, GOOGLE_SA_PRIVATE_KEY, GOOGLE_IMPERSONATE_EMAIL
 *  مشترک:      GOOGLE_CALENDAR_ID (پیش‌فرض: primary)
 *
 * اگر تنظیم نشده باشد، بی‌صدا null برمی‌گرداند تا جریان پرداخت نشکند.
 */

function getAuth() {
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return oauth2;
  }
  if (process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY) {
    return new google.auth.JWT({
      email: process.env.GOOGLE_SA_EMAIL,
      key: process.env.GOOGLE_SA_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
      subject: process.env.GOOGLE_IMPERSONATE_EMAIL,
    });
  }
  return null;
}

export type CalendarEventResult = {
  eventId: string;
  meetLink: string | null;
} | null;

export async function createConsultationEvent(params: {
  summary: string;
  description: string;
  startAt: string; // ISO
  endAt: string; // ISO
  attendeeEmail?: string;
}): Promise<CalendarEventResult> {
  const auth = getAuth();
  if (!auth) {
    console.warn('[google-calendar] اعتبارنامه تنظیم نشده؛ از ساخت رویداد صرف‌نظر شد.');
    return null;
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: auth as any });
    const res = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary: params.summary,
        description: params.description,
        start: { dateTime: params.startAt, timeZone: 'Asia/Tehran' },
        end: { dateTime: params.endAt, timeZone: 'Asia/Tehran' },
        attendees: params.attendeeEmail ? [{ email: params.attendeeEmail }] : undefined,
        conferenceData: {
          createRequest: {
            requestId: `owj-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    return {
      eventId: res.data.id!,
      meetLink: res.data.hangoutLink || null,
    };
  } catch (err) {
    console.error('[google-calendar] ساخت رویداد ناموفق:', err);
    return null;
  }
}
