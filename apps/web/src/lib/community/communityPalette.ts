/**
 * Single-accent palette for communities & events.
 *
 * Kartu komunitas/event dibedakan lewat kontennya (nama, kategori, tanggal),
 * bukan lewat rona. Satu aksen brand membuat permukaan tetap tenang dan
 * konsisten dengan bahasa desain yang dipakai di seluruh aplikasi.
 */

/** Aksen tipis di tepi atas kartu. */
const PROGRAM_ACCENT = "from-primary/40 to-primary/10";

/** Latar lembut untuk cover/header tanpa gambar. */
const PROGRAM_COVER = "from-primary/25 to-primary/5";

export function programColor(_index: number): string {
  return PROGRAM_ACCENT;
}

export function coverFromColor(_color: string): string {
  return PROGRAM_COVER;
}
