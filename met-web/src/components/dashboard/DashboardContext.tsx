import React, { createContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { getEngagements } from 'services/engagementService';
import { Engagement } from 'models/engagement';

export interface DashboardContextProps {
    isLoading: boolean;
    pageInfo: PageInfo;
    engagements: Engagement[];
    paginationOptions: PaginationOptions<Engagement>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<Engagement>>>;
}

export const DashboardContext = createContext<DashboardContextProps>({
    isLoading: true,
    pageInfo: createDefaultPageInfo(),
    engagements: [],
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
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [isLoading, setIsLoading] = useState(true);

    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Engagement>>({
        page: 1,
        size: 10,
        sort_key: 'name',
        nested_sort_key: 'name',
        sort_order: 'asc',
    });

    useEffect(() => {
        loadEngagements();
    }, [paginationOptions]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadEngagements = async () => {
        try {
            setIsLoading(true);
            const response = await getEngagements({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
            });
            setEngagements(response.items);
            setPageInfo({
                total: response.total,
            });
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
                engagements,
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
