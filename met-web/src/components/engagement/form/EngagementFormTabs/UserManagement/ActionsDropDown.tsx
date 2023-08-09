import React, { useMemo } from 'react';
import { Box, CircularProgress, MenuItem, Select } from '@mui/material';
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
    const { setTeamMembers } = React.useContext(EngagementTabsContext);
    const dispatch = useAppDispatch();

    const handleRevoke = async () => {
        try {
            setLoading(true);
            const revokedMembership = await revokeMembership(membership.engagement_id, membership.id);
            setTeamMembers((prev) =>
                prev.map((prevMembership) =>
                    prevMembership.id === membership.id ? { ...revokedMembership } : prevMembership,
                ),
            );
            setLoading(false);
        } catch (error) {
            setLoading(false);
            dispatch(openNotification({ text: 'Failed to revoke membership', severity: 'error' }));
        }
    };

    const handleReinstate = async () => {
        try {
            setLoading(true);
            const reinstatedMembership = await reinstateMembership(membership.engagement_id, membership.id);
            setTeamMembers((prev) =>
                prev.map((prevMembership) =>
                    prevMembership.id === membership.id ? { ...reinstatedMembership } : prevMembership,
                ),
            );
            setLoading(false);
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
                action: () => {
                    {
                        handleRevoke();
                    }
                },
                condition: membership.status !== ENGAGEMENT_MEMBERSHIP_STATUS.Revoked,
            },
            {
                value: 2,
                label: 'Reinstate',
                action: () => {
                    {
                        handleReinstate();
                    }
                },
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
            sx={{ backgroundColor: 'white', color: Palette.info.main }}
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
