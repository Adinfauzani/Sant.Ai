import { prisma } from "@/lib/db";
import { programColor, coverFromColor } from "@/lib/communityPalette";

export interface EventCardData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  registered: number;
  maxParticipants: number;
  organizer: string;
  color: string;
  cover: string;
}

export interface AgendaItem {
  time: string;
  activity: string;
  speaker?: string;
}

export interface Speaker {
  name: string;
  role: string;
  topic: string;
}

export interface EventDetailData extends EventCardData {
  description: string;
  agenda: AgendaItem[];
  speakers: Speaker[];
  requirements: string[];
  benefits: string[];
  contact: string;
  registeredByMe: boolean;
}

export interface EventsData {
  featured: EventCardData | null;
  upcoming: EventCardData[];
  past: EventCardData[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

function parseJsonArray<T>(value: string): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function toEventCard(
  e: {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    category: string;
    status: string;
    location: string;
    maxParticipants: number;
    organizer: string;
    startAt: Date;
    endAt: Date | null;
    _count: { registrations: number };
  },
  index: number,
): EventCardData {
  const color = programColor(index);
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    tagline: e.tagline,
    category: e.category,
    status: e.status,
    dateLabel: DATE_FORMATTER.format(e.startAt),
    timeLabel: `${TIME_FORMATTER.format(e.startAt)} - ${
      e.endAt ? `${TIME_FORMATTER.format(e.endAt)} WIB` : "WIB"
    }`,
    location: e.location,
    registered: e._count.registrations,
    maxParticipants: e.maxParticipants,
    organizer: e.organizer,
    color,
    cover: coverFromColor(color),
  };
}

export async function getEventsData(): Promise<EventsData> {
  const now = new Date();

  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      tagline: true,
      category: true,
      status: true,
      location: true,
      maxParticipants: true,
      organizer: true,
      startAt: true,
      endAt: true,
      _count: { select: { registrations: true } },
    },
  });

  const upcoming = events.filter((e) => e.startAt >= now);
  const past = events.filter((e) => e.startAt < now).reverse();

  return {
    featured: upcoming[0] ? toEventCard(upcoming[0], 0) : null,
    upcoming: upcoming.map(toEventCard),
    past: past.map((e, i) => toEventCard(e, i)),
  };
}

export async function getEventDetail(
  slug: string,
  viewerId?: string,
): Promise<EventDetailData | null> {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      registrations: viewerId ? { where: { userId: viewerId } } : false,
      _count: { select: { registrations: true } },
    },
  });

  if (!event) return null;

  const card = toEventCard(
    {
      id: event.id,
      slug: event.slug,
      title: event.title,
      tagline: event.tagline,
      category: event.category,
      status: event.status,
      location: event.location,
      maxParticipants: event.maxParticipants,
      organizer: event.organizer,
      startAt: event.startAt,
      endAt: event.endAt,
      _count: event._count,
    },
    0,
  );

  return {
    ...card,
    description: event.description,
    agenda: parseJsonArray<AgendaItem>(event.agenda),
    speakers: parseJsonArray<Speaker>(event.speakers),
    requirements: parseJsonArray<string>(event.requirements),
    benefits: parseJsonArray<string>(event.benefits),
    contact: event.contact,
    registeredByMe: viewerId ? event.registrations.length > 0 : false,
  };
}