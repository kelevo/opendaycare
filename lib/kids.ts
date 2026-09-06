export type ParentLink = {
  id: string;
  name: string;
  role: "Mamá" | "Papá" | "Tutor/a";
  status: "active" | "pending";
};

export type Kid = {
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  birthday: string;
  room: string;
  enrollment: string;
  avatarBg: string;
  avatarColor: string;
  allergy?: { label: string; note: string };
  needsLink?: boolean;
  linkedParents: ParentLink[];
};

export type ChildRow = {
  id: string;
  room_id: string;
  full_name: string;
  birth_date: string;
  enrolled_at: string;
  medical_notes: string | null;
  allergy_tags: string[];
};

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

const AVATAR_PALETTE: { bg: string; color: string }[] = [
  { bg: "#A9D9E8", color: "#1F7A93" },
  { bg: "#F4B8CC", color: "#C44A7A" },
  { bg: "#B9DEC4", color: "#3E8B62" },
  { bg: "#F4DC8E", color: "#9A7B1E" },
  { bg: "#C9B6E8", color: "#7B5FC0" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function avatarFromName(name: string): { bg: string; color: string } {
  return AVATAR_PALETTE[hashString(name.trim().toLowerCase()) % AVATAR_PALETTE.length];
}

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatShortDate(iso: string): string {
  const date = parseIsoDate(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatMonthYear(iso: string): string {
  const date = parseIsoDate(iso);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function ageFromIsoDate(iso: string): number {
  const birth = parseIsoDate(iso);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function childRowToKid(row: ChildRow, roomName: string): Kid {
  const parts = row.full_name.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  const avatar = avatarFromName(row.full_name);
  const allergyTags = (row.allergy_tags ?? []).map((tag) => tag.trim()).filter(Boolean);

  return {
    slug: row.id,
    firstName,
    lastName,
    age: ageFromIsoDate(row.birth_date),
    birthday: formatShortDate(row.birth_date),
    room: roomName,
    enrollment: formatMonthYear(row.enrolled_at),
    avatarBg: avatar.bg,
    avatarColor: avatar.color,
    allergy: allergyTags.length
      ? { label: allergyTags.join(", ").toUpperCase(), note: row.medical_notes ?? "" }
      : undefined,
    needsLink: false,
    linkedParents: [],
  };
}