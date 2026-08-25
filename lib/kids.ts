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

export const kids: Kid[] = [
  {
    slug: "mateo-fernandez",
    firstName: "Mateo",
    lastName: "Fernández",
    age: 3,
    birthday: "12 mar 2022",
    room: "Soles",
    enrollment: "feb 2025",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    allergy: {
      label: "MANÍ",
      note: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    },
    linkedParents: [
      { id: "lucia-fernandez", name: "Lucía Fernández", role: "Mamá", status: "active" },
      { id: "diego-fernandez", name: "Diego Fernández", role: "Papá", status: "pending" },
    ],
  },
  {
    slug: "sofia-mendez",
    firstName: "Sofía",
    lastName: "Méndez",
    age: 2,
    birthday: "20 sep 2022",
    room: "Soles",
    enrollment: "mar 2024",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    linkedParents: [{ id: "gabriela-mendez", name: "Gabriela Méndez", role: "Mamá", status: "active" }],
  },
  {
    slug: "benjamin-ruiz",
    firstName: "Benjamín",
    lastName: "Ruiz",
    age: 3,
    birthday: "2 ago 2021",
    room: "Soles",
    enrollment: "ago 2024",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    linkedParents: [
      { id: "camila-ruiz", name: "Camila Ruiz", role: "Mamá", status: "active" },
      { id: "joaquin-ruiz", name: "Joaquín Ruiz", role: "Papá", status: "pending" },
    ],
  },
  {
    slug: "valentina-soto",
    firstName: "Valentina",
    lastName: "Soto",
    age: 2,
    birthday: "14 feb 2023",
    room: "Soles",
    enrollment: "ene 2025",
    avatarBg: "#F4DC8E",
    avatarColor: "#9A7B1E",
    needsLink: true,
    linkedParents: [],
  },
  {
    slug: "tomas-diaz",
    firstName: "Tomás",
    lastName: "Díaz",
    age: 3,
    birthday: "22 nov 2021",
    room: "Soles",
    enrollment: "jul 2024",
    avatarBg: "#C9B6E8",
    avatarColor: "#7B5FC0",
    allergy: {
      label: "LACTOSA",
      note: "Intolerancia a la lactosa. Usar leche sin lactosa en el desayuno.",
    },
    linkedParents: [{ id: "valeria-diaz", name: "Valeria Díaz", role: "Mamá", status: "active" }],
  },
  {
    slug: "emma-castro",
    firstName: "Emma",
    lastName: "Castro",
    age: 2,
    birthday: "5 jul 2022",
    room: "Soles",
    enrollment: "sep 2024",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    linkedParents: [{ id: "florencia-castro", name: "Florencia Castro", role: "Mamá", status: "active" }],
  },
  {
    slug: "lucas-romero",
    firstName: "Lucas",
    lastName: "Romero",
    age: 3,
    birthday: "8 ene 2022",
    room: "Soles",
    enrollment: "abr 2024",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    linkedParents: [{ id: "federico-romero", name: "Federico Romero", role: "Papá", status: "active" }],
  },
  {
    slug: "olivia-vega",
    firstName: "Olivia",
    lastName: "Vega",
    age: 2,
    birthday: "30 abr 2023",
    room: "Soles",
    enrollment: "oct 2024",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    linkedParents: [{ id: "agustina-vega", name: "Agustina Vega", role: "Mamá", status: "active" }],
  },
];

export function getKidBySlug(slug: string): Kid | undefined {
  return kids.find((kid) => kid.slug === slug);
}

export type KidInput = {
  name: string;
  birthday: string; // dd/mm/aaaa
  room: string;
  allergies?: string;
  medicalNotes?: string;
};

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ageFromBirthday(birthday: string): number {
  const [day, month, year] = birthday.split("/").map(Number);
  const birth = new Date(year, month - 1, day);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function buildKidFromInput(input: KidInput, extraExisting: string[] = []): Kid {
  const name = input.name.trim();
  const parts = name.split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  const [day, month, year] = input.birthday.split("/").map(Number);

  const usedSlugs = new Set([...kids.map((kid) => kid.slug), ...extraExisting]);
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  const allergies = input.allergies?.trim();
  const medicalNotes = input.medicalNotes?.trim();

  return {
    slug,
    firstName,
    lastName,
    age: ageFromBirthday(input.birthday),
    birthday: `${day} ${MONTHS[month - 1]} ${year}`,
    room: input.room,
    enrollment: "—",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    allergy: allergies ? { label: allergies.toUpperCase(), note: medicalNotes ?? "" } : undefined,
    needsLink: false,
    linkedParents: [],
  };
}
