export type ParentLink = {
  id: string;
  name: string;
  role: "Mamá" | "Papá";
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
  allergy?: { label: "MANÍ" | "LACTOSA"; note: string };
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
