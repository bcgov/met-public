import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { createSearchParams, useFetcher, Outlet } from 'react-router-dom';

export interface EngagementUpdateData {
    id: number;
    status_id: number;
    taxon_id: number;
    content_id: number;
    name: string;
    start_date: Dayjs;
    end_date: Dayjs;
    description: string;
    rich_description: string;
    banner_filename: string;
    status_block: string[];
    title: string;
    icon_name: string;
    metadata_value: string;
    send_report: boolean;
    slug: string;
    request_type: string;
}

export const AuthoringContext = () => {
    const fetcher = useFetcher();
    const locationArray = window.location.href.split('/');
    const slug = locationArray[locationArray.length - 1];
    const defaultDateValue = dayjs(new Date(1970, 0, 1));
    const engagementUpdateForm = useForm<EngagementUpdateData>({
        defaultValues: {
            id: 0,
            status_id: 0,
            taxon_id: 0,
            content_id: 0,
            name: '',
            start_date: defaultDateValue,
            end_date: defaultDateValue,
            description: '',
            rich_description: '',
            banner_filename: '',
            status_block: [],
            title: '',
            icon_name: '',
            metadata_value: '',
            send_report: undefined,
            slug: '',
            request_type: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });
    const onSubmit = async (data: EngagementUpdateData) => {
        fetcher.submit(
            createSearchParams({
                id: 0 === data.id ? '' : data.id.toString(),
                status_id: 0 === data.status_id ? '' : data.status_id.toString(),
                taxon_id: 0 === data.taxon_id ? '' : data.taxon_id.toString(),
                content_id: 0 === data.content_id ? '' : data.content_id.toString(),
                name: data.name,
                start_date:
                    '1970-01-01' === data.start_date.format('YYYY-MM-DD') ? '' : data.start_date.format('YYYY-MM-DD'),
                end_date:
                    '1970-01-01' === data.start_date.format('YYYY-MM-DD') ? '' : data.end_date.format('YYYY-MM-DD'),
                description: data.description,
                rich_description: data.rich_description,
                banner_filename: data.banner_filename,
                status_block: data.status_block,
                title: data.title,
                icon_name: data.icon_name,
                metadata_value: data.metadata_value,
                send_report: getSendReportValue(data.send_report),
                slug: data.slug,
                request_type: data.request_type,
            }),
            {
                method: 'post',
                action: `/engagements/${data.id}/details/authoring/${slug}`,
            },
        );
    };

    const getSendReportValue = (valueToInterpret: boolean) => {
        if (undefined === valueToInterpret) {
            return '';
        }
        return valueToInterpret ? 'true' : 'false';
    };

    return (
        <FormProvider {...engagementUpdateForm}>
            <Outlet context={{ onSubmit }} />
        </FormProvider>
    );
};
