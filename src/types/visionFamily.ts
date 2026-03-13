export interface VisionFamilyApp {
    id: string;
    name: string;
    tagline: string;
    description: string;
    url: string | null;
    logo_url: string | null;
    logo_emoji: string;
    accent_color: string;
    category: string;
    is_published: boolean;
    is_featured: boolean;
    display_order: number;
    powered_by: string[] | null;
    created_at: string;
    updated_at: string;
}

export type VisionFamilyAppInsert = Omit<VisionFamilyApp, 'id' | 'created_at' | 'updated_at'>;
export type VisionFamilyAppUpdate = Partial<Omit<VisionFamilyApp, 'id' | 'created_at' | 'updated_at'>>;

/** Response from the fetch-site-metadata edge function */
export interface SiteMetadataResponse {
    success: boolean;
    metadata: {
        name: string;
        tagline: string;
        description: string;
        logo_url: string | null;
        logo_emoji: string;
        accent_color: string;
        category: string;
        powered_by: string[];
        url: string;
    } | null;
    raw: {
        title: string | null;
        og_title: string | null;
        og_description: string | null;
        og_image: string | null;
        og_site_name: string | null;
        meta_description: string | null;
        favicon: string | null;
    } | null;
    error?: string;
}
