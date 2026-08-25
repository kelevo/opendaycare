export type PostType = "Comida" | "Siesta" | "Actividad" | "Logro" | "Ánimo" | "Foto" | "Anuncio";

export const postTypes: { key: PostType; bg: string; color: string }[] = [
  { key: "Comida", bg: "#9A7B1E", color: "#fff" },
  { key: "Siesta", bg: "#E7DCF6", color: "#7B5FC0" },
  { key: "Actividad", bg: "#2E89A6", color: "#fff" },
  { key: "Logro", bg: "#CFEBD8", color: "#3E9B6C" },
  { key: "Ánimo", bg: "#F9D2DE", color: "#C56486" },
  { key: "Foto", bg: "#FBD8CC", color: "#D9684A" },
  { key: "Anuncio", bg: "#CCD8F4", color: "#4E72C8" },
];
