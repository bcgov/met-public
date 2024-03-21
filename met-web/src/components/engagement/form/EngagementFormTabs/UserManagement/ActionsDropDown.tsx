import React, { useMemo } from 'react';
import { CircularProgress, MenuItem, Select } from '@mui/material';
import { Palette } from 'styles/Theme';
import { ENGAGEMENT_MEMBERSHIP_STATUS, EngagementTeamMember } from 'models/engagementTeamMember';
import { reinstateMembership, revokeMembership } from 'services/membershipService';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ membership }: { membership: EngagementTeamMember }) => {
    const [loading, setLoading] = React.useState(false);
    const { loadTeamMembers } = React.useContext(EngagementTabsContext);
    const dispatch = useAppDispatch();

    const handleRevoke = async () => {
        try {
            setLoading(true);
            await revokeMembership(membership.engagement_id, membership.user_id);
            loadTeamMembers();
            setLoading(false);
            dispatch(
                openNotification({
                    text: `You have successfully revoked ${membership.user.first_name} ${membership.user.last_name} from ${membership.engagement?.name}`,
                    severity: 'success',
                }),
            );
        } catch (error) {
            setLoading(false);
            dispatch(openNotification({ text: 'Failed to revoke membership', severity: 'error' }));
        }
    };

    const handleReinstate = async () => {
        try {
            setLoading(true);
            await reinstateMembership(membership.engagement_id, membership.user_id);
            loadTeamMembers();
            setLoading(false);
            dispatch(
                openNotification({
                    text: `You have successfully reinstated ${membership.user.first_name} ${membership.user.last_name} on ${membership.engagement?.name}`,
                    severity: 'success',
                }),
            );
        } catch (error) {
            setLoading(false);
            dispatch(openNotification({ text: 'Failed to reinstate membership', severity: 'error' }));
        }
    };
    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Revoke',
                action: () => handleRevoke(),
                condition: membership.status !== ENGAGEMENT_MEMBERSHIP_STATUS.Revoked,
            },
            {
                value: 2,
                label: 'Reinstate',
                action: () => handleReinstate(),
                condition: membership.status !== ENGAGEMENT_MEMBERSHIP_STATUS.Active,
            },
        ],
        [membership.id, membership.status],
    );

    if (loading) {
        return <CircularProgress size={30} sx={{ color: Palette.info.main }} />;
    }

    return (
        <Select
            id={`action-drop-down-${membership.id}`}
            value={0}
            fullWidth
            size="small"
            sx={{ backgroundColor: 'var(--bcds-surface-background-white)', color: Palette.info.main }}
        >
            <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }} color="info" disabled>
                {'(Select One)'}
            </MenuItem>
            {ITEMS.filter((item) => item.condition).map((item) => (
                <MenuItem key={item.value} value={item.value} onClick={item.action}>
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    );
};
