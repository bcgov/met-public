import * as React from 'react';
import { SvgIcon } from '@mui/material';
import { ReactComponent as ExclamationIcon } from 'assets/images/exclamation.svg';
import { ReactComponent as LightbulbIcon } from 'assets/images/lightbulb.svg';
import { ReactComponent as ThinkingIcon } from 'assets/images/thinking.svg';
import { ReactComponent as VeryDissatisfiedIcon } from 'assets/images/emojiVeryDissatisfied.svg';
import { ReactComponent as DissatisfiedIcon } from 'assets/images/emojiDissatisfied.svg';
import { ReactComponent as NeutralIcon } from 'assets/images/emojiNeutral.svg';
import { ReactComponent as SatisfiedIcon } from 'assets/images/emojiSatisfied.svg';
import { ReactComponent as VerySatisfiedIcon } from 'assets/images/emojiVerySatisfied.svg';

export const customRatings: {
    [index: number]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    5: {
        icon: <SvgIcon fontSize="large" component={VeryDissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Very Dissatisfied',
    },
    4: {
        icon: <SvgIcon fontSize="large" component={DissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SvgIcon fontSize="large" component={NeutralIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Neutral',
    },
    2: {
        icon: <SvgIcon fontSize="large" component={SatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Satisfied',
    },
    1: {
        icon: <SvgIcon fontSize="large" component={VerySatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Very Satisfied',
    },
    0: {
        icon: <></>,
        label: '',
    },
};

export const commentTypes: {
    [index: number]: {
        icon: React.ReactElement;
        label: string;
        text: string;
    };
} = {
    1: {
        icon: <SvgIcon component={ExclamationIcon} viewBox="0 0 64 64" fontSize="large" />,
        label: 'An Issue',
        text: 'Something does not work...',
    },
    2: {
        icon: <SvgIcon component={LightbulbIcon} viewBox="0 0 64 64" fontSize="large" />,
        label: 'An Idea',
        text: 'I would like to see...',
    },
    3: {
        icon: <SvgIcon component={ThinkingIcon} viewBox="0 0 64 64" fontSize="large" />,
        label: 'A Question',
        text: 'I was wondering...',
    },
    0: {
        icon: <></>,
        label: '',
        text: '',
    },
};
