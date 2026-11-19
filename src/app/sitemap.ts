import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/projects'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...['/about', '/careers', '/nri-corner', '/media'].map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: now,
      changeFrequency: (p.status === 'completed' ? 'yearly' : 'monthly') as 'yearly' | 'monthly',
      priority: p.legacy ? 0.4 : p.status === 'completed' ? 0.6 : 0.8,
    })),
  ];
}
