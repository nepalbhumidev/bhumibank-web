import { MetadataRoute } from 'next';

// Force dynamic rendering for sitemap (blog posts change frequently)
export const dynamic = 'force-dynamic';

interface BlogItem {
    slug: string;
    updated_at: string;
    published_date?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Normalize baseUrl - remove trailing slash
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const apiUrl = process.env.NEXT_PUBLIC_URI || 'http://127.0.0.1:8000/';
    // Ensure no double slashes for API URL
    const baseApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Static pages - all public pages from navigation
    const staticPages: MetadataRoute.Sitemap = [
        // Homepage - highest priority
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // About section
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about/overview`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about/what-we-do`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Media section
        {
            url: `${baseUrl}/media`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        // Gallery
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Team
        {
            url: `${baseUrl}/team`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Events section
        {
            url: `${baseUrl}/events/notices`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/events/publications`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Reach Us
        {
            url: `${baseUrl}/reach-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // Forms
        {
            url: `${baseUrl}/forms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    try {
        // Use published_date instead of updated_at to match working API calls
        const apiEndpoint = `${baseApiUrl}/api/blogs?limit=100&sort_by=published_date&sort_order=-1`;
        console.log('Sitemap: Fetching from:', apiEndpoint);
        
        // Fetch all published blog posts
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Sitemap: API failed -', response.status, response.statusText);
            // Try to get error details
            try {
                const errorData = await response.json();
                console.error('Sitemap: Error details:', errorData);
            } catch {
                // Ignore JSON parse errors
            }
            return staticPages;
        }

        const blogs: BlogItem[] = await response.json();
        console.log('Sitemap: Received', Array.isArray(blogs) ? blogs.length : 'non-array', 'items');
        
        if (!Array.isArray(blogs)) {
            console.error('Sitemap: API returned non-array:', typeof blogs);
            return staticPages;
        }

        if (blogs.length === 0) {
            console.warn('Sitemap: No blogs found in API response');
            return staticPages;
        }

        // Map blog posts to sitemap entries
        const blogPages: MetadataRoute.Sitemap = blogs
            .filter(blog => {
                if (!blog || !blog.slug) {
                    console.warn('Sitemap: Skipping blog without slug:', blog);
                    return false;
                }
                return true;
            })
            .map((blog) => ({
                url: `${baseUrl}/media/${blog.slug}`,
                lastModified: new Date(blog.updated_at || blog.published_date || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));

        console.log('Sitemap: Generated', blogPages.length, 'blog entries');
        return [...staticPages, ...blogPages];
    } catch (error) {
        console.error('Sitemap: Error:', error);
        return staticPages;
    }
}