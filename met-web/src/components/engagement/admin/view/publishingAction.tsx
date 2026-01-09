import { EngagementStatus } from 'constants/engagementStatus';
import { ActionFunction } from 'react-router-dom';
import { patchEngagement } from 'services/engagementService';

export const publishingAction: ActionFunction = async ({ request }) => {
    const formData = (await request.formData()) as FormData;
    const engagementId = Number(formData.get('id'));
    if (engagementId && formData.get('scheduled_date') && formData.get('status_id')) {
        try {
            await patchEngagement({
                id: engagementId,
                scheduled_date: formData.get('scheduled_date') as unknown as string,
                status_id: formData.get('status_id') as unknown as EngagementStatus,
            });
            return 'success';
        } catch (e) {
            console.error('Error updating engagement', e);
            return 'failure';
        }
    } else {
        console.error('The publishing action could not be completed because the form values are not present.');
        return 'failure';
    }
};

export default publishingAction;
