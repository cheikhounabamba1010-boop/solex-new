import { useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { CATEGORIES } from '../data/categories';
import { SOLUTIONS } from '../data/solutions';
import { BRANDS } from '../data/brands';
import { BrandItem, CategoryInfo, SolutionItem } from '../types';

const toLines = (value: string): string[] =>
  value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

/** Catégories avec les modifications faites dans l'admin appliquées. */
export function useCategories(): CategoryInfo[] {
  const { get } = useContent();
  return useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        title: get(`cat.${c.id}.title`),
        headline: get(`cat.${c.id}.headline`),
        shortDesc: get(`cat.${c.id}.shortDesc`),
        fullDesc: get(`cat.${c.id}.fullDesc`),
        itemCount: get(`cat.${c.id}.itemCount`),
        tags: toLines(get(`cat.${c.id}.tags`)),
        image: get(`cat.${c.id}.image`),
        heroImage: get(`cat.${c.id}.heroImage`),
      })),
    [get]
  );
}

export function useSolutions(): SolutionItem[] {
  const { get } = useContent();
  return useMemo(
    () =>
      SOLUTIONS.map((s) => ({
        ...s,
        title: get(`sol.${s.id}.title`),
        subtitle: get(`sol.${s.id}.subtitle`),
        targetAudience: get(`sol.${s.id}.targetAudience`),
        description: get(`sol.${s.id}.description`),
        benefits: toLines(get(`sol.${s.id}.benefits`)),
        challenges: toLines(get(`sol.${s.id}.challenges`)),
        recommendedGear: toLines(get(`sol.${s.id}.recommendedGear`)),
        heroImage: get(`sol.${s.id}.heroImage`),
      })),
    [get]
  );
}

export function useBrands(): BrandItem[] {
  const { get } = useContent();
  return useMemo(
    () =>
      BRANDS.map((b) => ({
        ...b,
        name: get(`brand.${b.slug}.name`),
        tier: get(`brand.${b.slug}.tier`),
        origin: get(`brand.${b.slug}.origin`),
        specialty: get(`brand.${b.slug}.specialty`),
        description: get(`brand.${b.slug}.description`),
      })),
    [get]
  );
}
