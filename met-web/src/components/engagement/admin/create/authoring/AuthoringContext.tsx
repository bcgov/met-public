import React from 'react';
import { Dayjs } from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { createSearchParams, useFetcher, Outlet } from 'react-router-dom';

export interface EngagementUpdateData {
    id: number;
    name: string;
    start_date: Dayjs;
    end_date: Dayjs;
    status_id: number;
    description: string;
    rich_description: string;
    banner_filename: string;
    status_block: string[];
    title: string;
    icon_name: string;
    metadata_value: string;
    taxon_id: number;
    send_report: boolean;
    slug: string;
    request_type: string;
}

export const AuthoringContext = () => {
    const fetcher = useFetcher();
    const locationArray = window.location.href.split('/');
    const slug = locationArray[locationArray.length - 1];
    const engagementUpdateForm = useForm<EngagementUpdateData>({
        defaultValues: {
            id: 0,
            name: '',
            start_date: undefined,
            end_date: undefined,
            status_id: 0,
            description: '',
            rich_description: '',
            banner_filename: '',
            status_block: [],
            title: '',
            icon_name: '',
            metadata_value: '',
            taxon_id: 0,
            send_report: false,
            slug: '',
            request_type: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: EngagementUpdateData) => {
        fetcher.submit(
            createSearchParams({
                id: data.id.toString(),
                name: data.name,
                start_date: data.start_date.format('YYYY-MM-DD'),
                end_date: data.end_date.format('YYYY-MM-DD'),
                description: data.description,
                rich_description: data.rich_description,
                banner_filename: data.banner_filename,
                status_block: data.status_block,
                title: data.title,
                icon_name: data.icon_name,
                metadata_value: data.metadata_value,
                taxon_id: data.taxon_id.toString(),
                send_report: data.send_report ? 'true' : 'false',
                slug: data.slug,
                request_type: data.request_type,
            }),
            {
                method: 'post',
                action: `/engagements/${data.id}/authoring/${slug}`,
            },
        );
    };

    return (
        <FormProvider {...engagementUpdateForm}>
            <Outlet context={{ onSubmit }} />
        </FormProvider>
    );
};
