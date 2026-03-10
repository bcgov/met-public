import React, { useId } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import {
    faCircle1,
    faCircle2,
    faCircle3,
    faCircle4,
    faCircle5,
    faCircle6,
    faCircle7,
    faCircle8,
    faCircle9,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { colors } from 'styles/Theme';
import { BodyText } from '../Typography';

const circleNumberIcons = [
    faCircle1,
    faCircle2,
    faCircle3,
    faCircle4,
    faCircle5,
    faCircle6,
    faCircle7,
    faCircle8,
    faCircle9,
];

/**
 * A component that represents a step in a form, displaying the step number and its status.
 * Can be used to visually indicate progress in a multi-step form.
 * Extends a line down the left side that is colored based on the step's completion status.
 * It includes a title, optional details, and children components for additional content.
 * The step can be marked as completing or completed, and it can be grouped with other steps.
 * @param {Object} props - The properties for the form step component.
 * @param {number} props.step - The step number to display.
 * @param {boolean} [props.completing=false] - Indicates if the step is currently being completed. Highlights the step with a different color.
 * @param {boolean} [props.completed=false] - Indicates if the step has been completed. Replaces the step number with a check icon.
 * @param {string} [props.question] - The main question or title for the step.
 * @param {string} [props.details] - Additional details or instructions for the step.
 * @param {string} [props.labelFor] - The ID of the input element associated with this step, for accessibility.
 * @param {boolean} [props.isGroup=false] - If false, the step text acts as a label for an input element.
 * If true, the step text acts as a legend for a fieldset element, grouping related form elements.
 * @param {React.ReactNode} [children] - Additional content to render within the step.
 * @returns {JSX.Element} A styled grid component representing the form step.
 * @example
 * <FormStep
 *     step={1}
 *     completing={true}
 *     completed={false}
 *   question="What is your name?"
 */
export const FormStep = ({
    step,
    completing,
    completed,
    question,
    details,
    labelFor,
    isGroup,
    children,
}: {
    step: number;
    completing?: boolean;
    completed?: boolean;
    question?: string;
    details?: string;
    labelFor?: string;
    isGroup?: boolean;
    children?: React.ReactNode;
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const activityColor = completed || completing || isFocused ? colors.surface.blue[90] : colors.surface.gray[70];
    const titleId = useId();
    const instructionsId = useId();

    return (
        <Grid
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={1}
            sx={{
                padding: '1rem',
                backgroundColor: 'white',
                marginBottom: '1rem',
                maxWidth: '100%',
            }}
        >
            <Grid container size="auto" justifyContent="flex-start" direction="column" width="2rem">
                <Grid size="auto">
                    <FontAwesomeIcon
                        icon={completed ? faCircleCheck : circleNumberIcons[step - 1]}
                        color={activityColor}
                        size="2x"
                    />
                </Grid>
                <Grid size="grow">
                    <Box
                        sx={{
                            height: '100%',
                            width: '1rem',
                            borderRight: '1px solid',
                            borderColor: activityColor,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                size="grow"
                maxWidth="100%"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap={0}
                p={0}
                m={0}
                pb="16px"
                component={isGroup ? 'fieldset' : 'div'}
                aria-labelledby={titleId + ' ' + instructionsId}
                border="none"
            >
                <Grid size={12} lineHeight="2rem" fontSize="1.25rem" mb={1.25}>
                    <BodyText
                        fontSize="1.25rem"
                        p={0}
                        my={0}
                        fontWeight={400}
                        lineHeight="2rem"
                        component={isGroup ? 'legend' : 'label'}
                        id={titleId}
                        {...({ htmlFor: isGroup ? undefined : labelFor } as object)}
                    >
                        {question}
                    </BodyText>
                </Grid>
                <Grid hidden={!details} sx={{ marginBottom: '1.5rem', lineHeight: '1.5rem' }} size={12}>
                    <BodyText
                        letterSpacing="calc(13 / 990 * -1rem)"
                        lineHeight="1.5rem"
                        id={instructionsId}
                        size="small"
                        component={isGroup ? 'p' : 'label'}
                        {...({ htmlFor: isGroup ? undefined : labelFor } as object)}
                    >
                        {details}
                    </BodyText>
                </Grid>
                <Grid size={12}>{children}</Grid>
            </Grid>
        </Grid>
    );
};
