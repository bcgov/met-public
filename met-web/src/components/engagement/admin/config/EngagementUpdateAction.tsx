import { ENGAGEMENT_MEMBERSHIP_STATUS } from 'models/engagementTeamMember';
import { ActionFunction, redirect } from 'react-router-dom';
import { patchEngagement } from 'services/engagementService';
import { patchEngagementSlug } from 'services/engagementSlugService';
import {
    addTeamMemberToEngagement,
    revokeMembership,
    reinstateMembership,
    getTeamMembers,
} from 'services/membershipService';

export const engagementUpdateAction: ActionFunction = async ({ request, params }) => {
    const formData = (await request.formData()) as FormData;
    const engagementId = Number(params.engagementId);
    await patchEngagement({
        id: engagementId,
        name: formData.get('name') as string,
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string,
        is_internal: formData.get('is_internal') === 'true',
    });
    try {
        await patchEngagementSlug({
            engagement_id: engagementId,
            slug: formData.get('slug') as string,
        });
    } catch (e) {
        console.error('Error updating engagement slug', e);
    }

    const currentTeamMembers = await getTeamMembers({ engagement_id: engagementId });
    const users = formData.getAll('users') as string[];
    const usersSet = new Set(users);

    try {
        // Process deactivated users for reinstatement (and active users for revocation)
        // Caution - headaches ahead! There is a big difference between user_id and user.external_id
        for (const member of currentTeamMembers) {
            const isUserInForm = usersSet.has(String(member.user.external_id));
            if (member.status !== ENGAGEMENT_MEMBERSHIP_STATUS.Active) {
                if (isUserInForm) {
                    // If the user was previously deactivated, reinstate them
                    reinstateMembership(engagementId, member.user_id);
                }
            } else if (!isUserInForm) {
                // If the user was previously active but is not in the form, revoke their membership
                revokeMembership(engagementId, member.user_id);
            }

            // Remove all known users from the set so we can add new members in the next step
            usersSet.delete(String(member.user.external_id));
        }
        // Add new members that weren't in the current team members list
        for (const user of usersSet) {
            addTeamMemberToEngagement({ user_id: user, engagement_id: engagementId });
        }
    } catch (e) {
        console.error('Error updating team members', e);
    }

    return redirect(`/engagements/${engagementId}/view`);
};

export default engagementUpdateAction;
