import { AuthoringValue } from './types';

export const getDefaultAuthoringTabValues = (type: string): AuthoringValue[] => {
    if ('sections' === type) {
        // Return the default "section" items
        return [
            {
                id: 1,
                title: 'Hero Banner',
                link: `authoring/banner`,
                required: true,
                completed: false,
            },
            {
                id: 2,
                title: 'Summary',
                link: `authoring/summary`,
                required: true,
                completed: false,
            },
            {
                id: 3,
                title: 'Details',
                link: `authoring/details`,
                required: true,
                completed: false,
            },
            {
                id: 4,
                title: 'Provide Feedback',
                link: `authoring/feedback`,
                required: true,
                completed: false,
            },
            {
                id: 5,
                title: 'View Results',
                link: `authoring/results`,
                required: false,
                completed: false,
            },
            {
                id: 6,
                title: 'Subscribe',
                link: `authoring/subscribe`,
                required: false,
                completed: false,
            },
            {
                id: 7,
                title: 'More Engagements',
                link: `authoring/more`,
                required: false,
                completed: false,
            },
        ];
    } else {
        // Return the default "feedback" items
        return [
            {
                id: 101,
                title: 'Survey',
                link: `#`,
                required: true,
                completed: false,
            },
            {
                id: 102,
                title: '3rd Party Feedback Method Link',
                link: `#`,
                required: true,
                completed: false,
            },
        ];
    }
};
