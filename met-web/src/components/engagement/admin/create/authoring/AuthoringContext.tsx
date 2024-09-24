import React, { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { createSearchParams, useFetcher, Outlet, useMatch } from 'react-router-dom';
import { EditorState } from 'draft-js';
import * as yup from 'yup';
import { EngagementViewSections } from 'components/engagement/public/view';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { saveObject } from 'services/objectStorageService';

const authoringTemplateSchema = yup.object({
    name: yup.string().required('Engagement title is required'),
    eyebrow: yup.string().nullable().max(40, 'Eyebrow text must be 40 characters or less'),
    image_url: yup
        .string()
        .url('Image URL must be a valid URL')
        .when('image_file', (image_file: File, schema: yup.AnySchema) => {
            return image_file ? schema.notRequired() : schema.required('An image is required');
        }),
    image_file: yup.mixed().nullable(),
    upcoming_message: yup.string(),
    _upcoming_message_plain: yup.string().max(150, '"Upcoming" state message must be 150 characters or less'),
    open_cta: yup.string().max(20, '"Open" state CTA must be 20 characters or less'),
    open_cta_link_type: yup.string().required('Primary CTA link type is required').oneOf(['internal', 'external']),
    open_section_link: yup
        .string()
        .nullable()
        .when('cta_link_type', {
            is: 'internal',
            then: yup.string().required('Section link is required').oneOf(Object.values(EngagementViewSections)),
        }),
    open_external_link: yup
        .string()
        .nullable()
        .when('cta_link_type', {
            is: 'external',
            then: yup.string().url('External link must be a valid URL').required('A link is required'),
        }),
    closed_message: yup.string(),
    _closed_message_plain: yup.string().max(150, '"Closed" state message must be 150 characters or less'),
    view_results_cta: yup.string().max(20, '"View Results" state CTA must be 20 characters or less'),
    view_results_link_type: yup.string().required('View results link type is required').oneOf(['internal', 'external']),
    view_results_section_link: yup
        .string()
        .nullable()
        .when('view_results_link_type', {
            is: 'internal',
            then: yup.string().required('A link is required').oneOf(Object.values(EngagementViewSections)),
        }),
    view_results_external_link: yup
        .string()
        .nullable()
        .when('view_results_link_type', {
            is: 'external',
            then: yup.string().url('External link must be a valid URL').required('A link is required'),
        }),
});

export interface EngagementUpdateData extends yup.TypeOf<typeof authoringTemplateSchema> {
    id: number;
    status_id: number;
    taxon_id: number;
    content_id: number;
    name: string;
    start_date: Dayjs;
    end_date: Dayjs;
    description: string;
    rich_description: string;
    description_title: string;
    banner_filename: string;
    status_block: string[];
    title: string;
    icon_name: string;
    metadata_value: string;
    send_report: boolean | undefined;
    slug: string;
    request_type: string;
    text_content: string;
    json_content: string;
    summary_editor_state: EditorState;
}

export const defaultValuesObject = {
    id: 0,
    status_id: 0,
    taxon_id: 0,
    content_id: 0,
    start_date: dayjs(new Date(1970, 0, 1)),
    end_date: dayjs(new Date(1970, 0, 1)),
    description: '',
    rich_description: '',
    description_title: '',
    banner_filename: '',
    status_block: [],
    title: '',
    icon_name: '',
    metadata_value: '',
    send_report: undefined,
    slug: '',
    request_type: '',
    text_content: '',
    json_content: '{ blocks: [], entityMap: {} }',
    summary_editor_state: EditorState.createEmpty(),
    // Hero banner fields
    name: '',
    eyebrow: '',
    image_url: '',
    image_file: undefined,
    upcoming_message: '',
    _upcoming_message_plain: '',
    open_cta: '',
    open_cta_link_type: 'internal',
    open_section_link: EngagementViewSections.PROVIDE_FEEDBACK,
    open_external_link: '',
    closed_message: '',
    _closed_message_plain: '',
    view_results_cta: '',
    view_results_link_type: 'internal',
    view_results_section_link: EngagementViewSections.PROVIDE_FEEDBACK,
    view_results_external_link: '',
} as EngagementUpdateData;

export const AuthoringContext = () => {
    const [defaultValues, setDefaultValues] = useState(defaultValuesObject);
    const fetcher = useFetcher();
    // Check if the form has succeeded or failed after a submit, and issue a message to the user.
    const dispatch = useAppDispatch();
    useEffect(() => {
        if ('success' === fetcher.data || 'failure' === fetcher.data) {
            const responseText =
                'success' === fetcher.data ? 'Engagement saved successfully.' : 'Unable to save engagement.';
            const responseSeverity = 'success' === fetcher.data ? 'success' : 'error';
            dispatch(
                openNotification({
                    severity: responseSeverity,
                    text: responseText,
                }),
            );
            fetcher.data = undefined;
        }
    }, [fetcher.data]);
    const pageName = useMatch('/engagements/:engagementId/details/authoring/:page')?.params.page;
    // Set the form resolver based on the page name
    const resolver = useMemo(() => {
        switch (pageName) {
            case 'banner':
                return yupResolver(authoringTemplateSchema);
            default:
                return undefined;
        }
    }, [pageName]);
    const engagementUpdateForm = useForm<EngagementUpdateData>({
        defaultValues: useMemo(() => defaultValues, [defaultValues]),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: resolver,
    });
    const onSubmit = async (data: EngagementUpdateData) => {
        const savedImageDetails = data.image_file
            ? await saveObject(data.image_file, { filename: data.image_file.name })
            : undefined;

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
                description_title: data.description_title,
                status_block: data.status_block,
                title: data.title,
                icon_name: data.icon_name,
                metadata_value: data.metadata_value,
                send_report: (data.send_report || '').toString(),
                slug: data.slug,
                request_type: data.request_type,
                text_content: data.text_content,
                json_content: data.json_content,

                banner_filename: savedImageDetails?.uniquefilename || '',

                eyebrow: data.eyebrow || '',
                upcoming_message: data.upcoming_message || '',
                _upcoming_message_plain: data._upcoming_message_plain || '',
                open_cta: data.open_cta || '',
                open_cta_link_type: data.open_cta_link_type || '',
                open_section_link: data.open_section_link || '',
                open_external_link: data.open_external_link || '',
                closed_message: data.closed_message || '',
                _closed_message_plain: data._closed_message_plain || '',
                view_results_cta: data.view_results_cta || '',
                view_results_link_type: data.view_results_link_type || '',
                view_results_section_link: data.view_results_section_link || '',
                view_results_external_link: data.view_results_external_link || '',
            }),
            {
                method: 'post',
                action: `/engagements/${data.id}/details/authoring/${pageName}`,
            },
        );
    };

    return (
        <FormProvider {...engagementUpdateForm}>
            <Outlet context={{ onSubmit, defaultValues, setDefaultValues, fetcher }} />
        </FormProvider>
    );
};
