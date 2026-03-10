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
