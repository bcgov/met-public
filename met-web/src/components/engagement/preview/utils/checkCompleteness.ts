import { Engagement } from 'models/engagement';

/**
 * Checks if an engagement has all required sections completed.
 * Based on the required sections in the authoring flow:
 * - Hero Banner (image, name, description)
 * - Summary (rich description)
 * - Details (content/description tabs)
 * - Provide Feedback (survey assigned)
 *
 * @param engagement - The engagement to check
 * @returns true if all required sections are complete, false otherwise
 */
export const checkEngagementCompleteness = (engagement: Engagement): boolean => {
    const requiredChecks = [
        // Hero Banner required fields
        Boolean(engagement.banner_url),
        Boolean(engagement.name && engagement.name.trim().length > 0),
        Boolean(engagement.description && engagement.description.trim().length > 0),

        // Summary required fields
        Boolean(engagement.rich_description && engagement.rich_description.trim().length > 0),

        // Details required fields (rich content)
        Boolean(engagement.rich_content && engagement.rich_content.trim().length > 0),

        // Feedback required fields (at least one survey)
        Boolean(engagement.surveys && engagement.surveys.length > 0),
    ];

    return requiredChecks.every((check) => check === true);
};

export default checkEngagementCompleteness;
