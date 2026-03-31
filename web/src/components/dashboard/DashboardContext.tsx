import React, { createContext, useState, useEffect, JSX } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { getEngagements } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import { EngagementDisplayStatus } from 'constants/engagementStatus';

export interface DashboardContextProps {
    isLoading: boolean;
    pageInfo: PageInfo;
    openEngagements: Engagement[];
    upcomingEngagements: Engagement[];
    closedEngagements: Engagement[];
    paginationOptions: PaginationOptions<Engagement>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<Engagement>>>;
}

export const DashboardContext = createContext<DashboardContextProps>({
    isLoading: true,
    pageInfo: createDefaultPageInfo(),
    openEngagements: [],
    upcomingEngagements: [],
    closedEngagements: [],
    paginationOptions: {
        page: 0,
        size: 0,
    },
    setPaginationOptions: () => {
        throw new Error('Not implemented');
    },
});

export const DashboardContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const [openEngagements, setOpenEngagements] = useState<Engagement[]>([]);
    const [upcomingEngagements, setUpcomingEngagements] = useState<Engagement[]>([]);
    const [closedEngagements, setClosedEngagements] = useState<Engagement[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [isLoading, setIsLoading] = useState(true);

    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Engagement>>({
        page: 1,
        size: 100,
        sort_key: 'id',
        nested_sort_key: 'engagement.id',
        sort_order: 'desc',
    });

    useEffect(() => {
        loadEngagements();
    }, [paginationOptions]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadEngagements = async () => {
        try {
            setIsLoading(true);
            const openEngagement = await getEngagements({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                engagement_status: [EngagementDisplayStatus.Open],
            });
            setOpenEngagements(openEngagement.items);
            setPageInfo({
                total: openEngagement.total,
            });
            const upcomingEngagement = await getEngagements({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                engagement_status: [EngagementDisplayStatus.Upcoming],
            });
            setUpcomingEngagements(upcomingEngagement.items);
            const closedEngagement = await getEngagements({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                engagement_status: [EngagementDisplayStatus.Closed],
            });
            setClosedEngagements(closedEngagement.items);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch engagements, please refresh the page or try again at a later time',
                }),
            );
            setIsLoading(false);
        }
    };

    return (
        <DashboardContext.Provider
            value={{
                openEngagements,
                upcomingEngagements,
                closedEngagements,
                pageInfo,
                isLoading,
                paginationOptions,
                setPaginationOptions,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
