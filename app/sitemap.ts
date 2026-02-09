import { MetadataRoute } from 'next';

interface BlogItem {
    slug: string;
    updated_at: string;
    published_date?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = process.env.NEXT_PUBLIC_URI || 'http://127.0.0.1:8000/';
    
    // Ensure no double slashes
    const baseApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/media`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    try {
        // Fetch all published blog posts
        const response = await fetch(`${baseApiUrl}/api/blogs?limit=1000&sort_by=updated_at&sort_order=-1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch blogs for sitemap:', response.status);
            return staticPages;
        }

        const blogs: BlogItem[] = await response.json();

        // Map blog posts to sitemap entries
        const blogPages: MetadataRoute.Sitemap = blogs
            .filter(blog => blog.slug) // Only include blogs with slugs
            .map((blog) => ({
                url: `${baseUrl}/media/${blog.slug}`,
                lastModified: new Date(blog.updated_at || blog.published_date || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));

        return [...staticPages, ...blogPages];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Return static pages even if blog fetch fails
        return staticPages;
    }
}
