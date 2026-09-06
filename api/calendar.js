module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { google } = require('googleapis');
    const { bookingId, name, email, date, time, duration, notes, tz } = req.body;

    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      return res.status(500).json({ message: 'Google credentials are not configured' });
    }

    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/calendar.events']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // Handle timezone correctly
    const startDateTime = new Date(`${date}T${time}:00`); 
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const event = {
      summary: `Meeting with ${name}`,
      description: `Notes: ${notes}\nBooking ID: ${bookingId}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: tz || 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: tz || 'UTC',
      },
      attendees: [{ email: email }],
      conferenceData: {
        createRequest: {
          requestId: bookingId,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    const eventId = response.data.id;

    res.status(200).json({ success: true, meetLink, eventId });
  } catch (error) {
    console.error('Calendar API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
