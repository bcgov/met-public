import React, { useId } from 'react';
import { Box, Grid } from '@mui/material';
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
import { BodyText, Header2 } from '../Typography';

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
            <Grid
                item
                container
                alignItems="stretch"
                direction="column"
                gap={1}
                sx={{ pt: 1.25, fontSize: '16px', width: '3rem' }}
            >
                <Grid item>
                    <FontAwesomeIcon
                        icon={completed ? faCircleCheck : circleNumberIcons[step - 1]}
                        color={activityColor}
                        size="2x"
                    />
                </Grid>
                <Grid item xs>
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
                item
                container
                xs
                justifyContent="flex-start"
                alignItems="flex-start"
                pb="16px"
                component={isGroup ? 'fieldset' : 'div'}
                aria-labelledby={titleId + ' ' + instructionsId}
                sx={{ border: 'none' }}
            >
                {isGroup ? (
                    <>
                        <legend id={titleId} style={{ marginBottom: 0, fontSize: '20px', fontWeight: 300, padding: 0 }}>
                            {question}
                        </legend>
                        {details && (
                            <Grid item sx={{ marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
                                <BodyText size="small">
                                    <span id={instructionsId}>{details}</span>
                                </BodyText>
                            </Grid>
                        )}
                    </>
                ) : (
                    <Grid item xs={12}>
                        <Header2 sx={{ mt: 0, fontSize: '20px', fontWeight: '300' }}>
                            <label htmlFor={labelFor} id={titleId}>
                                {question}
                            </label>
                        </Header2>
                    </Grid>
                )}
                {!isGroup && details && (
                    <Grid item sx={{ marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
                        <BodyText size="small">
                            <label htmlFor={labelFor} id={instructionsId}>
                                {details}
                            </label>
                        </BodyText>
                    </Grid>
                )}
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Grid>
    );
};
