export interface UserData {
    name: string;
    image: string | null;
    email: string;
    id: string;
    loyaltyPoints?: number;
    createdAt?: Date;
    bio?: string;
    socialLinks?: string;
}

export interface VideoData {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    videoUrl: string;
    views: number;
    likes: number;
    createdAt: string;
    status: 'published' | 'draft' | 'private';
}
