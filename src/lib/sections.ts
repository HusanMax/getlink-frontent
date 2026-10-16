import {
  BookOpen,
  Film,
  Globe,
  Send,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import type { ResourceType } from '../types';

export interface SectionMeta {
  type: ResourceType;
  label: string;
  path: string;
  tagline: string;
  blurb: string;
  icon: LucideIcon;
  /** Tailwind gradient classes for identity surfaces. */
  gradient: string;
  /** Singular noun used in copy, e.g. "channel". */
  noun: string;
}

export const SECTIONS: Record<ResourceType, SectionMeta> = {
  website: {
    type: 'website',
    label: 'Veb-saytlar',
    path: '/websites',
    tagline: 'Vositalar, hujjatlar va platformalar',
    blurb: 'Seimga qoʻyishga loyiq veb-yordamchilar va manbalar — hujjatlar, platformalar va kundalik vositalar.',
    icon: Globe,
    gradient: 'from-indigo-500 to-sky-400',
    noun: 'sayt',
  },
  youtube: {
    type: 'youtube',
    label: 'YouTube',
    path: '/youtube',
    tagline: 'Obuna boʻlishga loyiq kanallar',
    blurb: 'Dasturlash, fan va gʻoyalarda barqaror ravishda zoʻr materiallar taqdim etuvchi ijodkorlar va kanallar.',
    icon: Youtube,
    gradient: 'from-red-600 to-orange-500',
    noun: 'kanal',
  },
  telegram: {
    type: 'telegram',
    label: 'Telegram',
    path: '/telegram',
    tagline: 'Hamjamiyatlar va foydali axborot',
    blurb: 'Siz uchun muhim boʻlgan hamjamiyatlar bilan aloqani ushlab turadigan kanallar va guruhlar.',
    icon: Send,
    gradient: 'from-sky-500 to-blue-600',
    noun: 'kanal',
  },
  book: {
    type: 'book',
    label: 'Kitoblar',
    path: '/books',
    tagline: 'Sokin kutubxona',
    blurb: 'Fikrlash, qurish va yashash tarzimni oʻzgartirgan kitoblarning tanlangan tokchasi.',
    icon: BookOpen,
    gradient: 'from-amber-500 to-amber-700',
    noun: 'kitob',
  },
  movie: {
    type: 'movie',
    label: 'Kinolar',
    path: '/movies',
    tagline: 'Tavsiya etilgan kinolar',
    blurb: 'Bir kechaga munosib filmlar — har biri nega tanlanganini qisqacha izoh bilan.',
    icon: Film,
    gradient: 'from-fuchsia-500 to-pink-600',
    noun: 'film',
  },
};

export const SECTION_LIST: SectionMeta[] = Object.values(SECTIONS);

export function sectionByType(type: string): SectionMeta {
  return SECTIONS[type as ResourceType] ?? SECTIONS.website;
}

export function sectionByPath(path: string): SectionMeta | undefined {
  return SECTION_LIST.find((s) => s.path === path);
}
