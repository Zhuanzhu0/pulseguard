/**
 * External service configuration
 * Centralizes external API URLs for easier management and security auditing
 */

/**
 * Avatar generation service configuration
 * Using DiceBear API for generating consistent avatar images
 * @see https://dicebear.com/
 */
export const AVATAR_CONFIG = {
    /**
     * Base URL for the avatar generation service
     * Can be overridden via environment variable for self-hosted instances
     */
    baseUrl: process.env.NEXT_PUBLIC_AVATAR_SERVICE_URL || "https://api.dicebear.com/7.x",
    
    /**
     * Default avatar style
     */
    style: "avataaars",
    
    /**
     * Generate avatar URL for a given seed (e.g., user name)
     * @param seed - String to generate consistent avatar (typically user name)
     * @returns Full avatar image URL
     */
    getAvatarUrl: (seed: string): string => {
        const encodedSeed = encodeURIComponent(seed);
        return `${AVATAR_CONFIG.baseUrl}/${AVATAR_CONFIG.style}/svg?seed=${encodedSeed}`;
    },
} as const;

/**
 * External API endpoints configuration
 * Add other external service URLs here as the app grows
 */
export const EXTERNAL_SERVICES = {
    avatar: AVATAR_CONFIG,
} as const;
