import { getCalendar } from "./google";

export async function createBrainstormInvite({
  attendeeEmail,
  attendeeName,
  ideaTitle,
  preferredDate,
}: {
  attendeeEmail: string;
  attendeeName: string;
  ideaTitle: string;
  preferredDate?: string;
}) {
  const calendar = getCalendar();
  if (!calendar) {
    console.warn("Google Calendar not configured — skipping invite");
    return null;
  }

  const startDate = preferredDate
    ? new Date(preferredDate)
    : getNextAvailableSlot();

  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const event = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: `BuildwithAiGiri Brainstorm: ${ideaTitle}`,
      description: [
        `1-hour brainstorming call for BuildwithAiGiri MVP.`,
        "",
        `Idea: ${ideaTitle}`,
        `Collaborator: ${attendeeName} (${attendeeEmail})`,
        "",
        "Agenda:",
        "• Define the core problem and target user",
        "• Scope MVP features for a 1-week build",
        "• Discuss architecture and tech stack",
        "• Agree on deliverables and communication plan",
        "",
        "— Girish Hiremath",
        "https://buildwithaigiri.vercel.app",
      ].join("\n"),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      attendees: [
        { email: attendeeEmail, displayName: attendeeName },
        { email: process.env.ADMIN_EMAIL || "gen.girish@gmail.com" },
      ],
      conferenceData: {
        createRequest: {
          requestId: `bwag-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    },
  });

  return {
    eventId: event.data.id,
    htmlLink: event.data.htmlLink,
    meetLink: event.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video",
    )?.uri,
    start: event.data.start?.dateTime,
    end: event.data.end?.dateTime,
  };
}

function getNextAvailableSlot(): Date {
  const now = new Date();
  const slot = new Date(now);

  slot.setDate(slot.getDate() + 2);

  slot.setHours(10, 0, 0, 0);

  if (slot.getDay() === 0) slot.setDate(slot.getDate() + 1);
  if (slot.getDay() === 6) slot.setDate(slot.getDate() + 2);

  return slot;
}
