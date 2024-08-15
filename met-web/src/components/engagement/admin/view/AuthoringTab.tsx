import React, { useState, useEffect } from 'react';
import { AuthoringValue, AuthoringButtonProps, StatusCircleProps } from './types';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/pro-light-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { MetLabel, MetHeader3 } from 'components/common';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { When } from 'react-if';
import { Grid, Link } from '@mui/material';
import { colors } from 'styles/Theme';

const StatusCircle = (props: StatusCircleProps) => {
    const statusCircleStyles = {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: props.required ? colors.notification.danger.icon : colors.surface.gray[70],
        marginLeft: '0.3rem',
        marginTop: '-1rem',
    };
    return <span style={statusCircleStyles}> </span>;
};

const AuthoringButton = (props: AuthoringButtonProps) => {
    const buttonStyles = {
        display: 'flex',
        width: '100%',
        height: '3rem',
        backgroundColor: props.item.required ? colors.surface.blue[10] : colors.surface.gray[10],
        borderRadius: '8px',
        border: 'none',
        padding: '0 1rem 0 2.5rem',
        margin: '0 0 0.5rem',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
    };
    const textStyles = {
        fontSize: '1rem',
        color: colors.type.regular.primary,
    };
    const arrowStyles = {
        color: colors.surface.blue[90],
        fontSize: '1.3rem',
        marginLeft: 'auto',
    };
    const checkStyles = {
        color: colors.type.regular.primary,
        fontSize: '1rem',
        fontWeight: 'bold',
        paddingRight: '0.4rem',
    };
    return (
        <Link style={{ textDecoration: 'none' }} href={props.item.link}>
            <button style={buttonStyles}>
                <When condition={props.item.completed}>
                    <FontAwesomeIcon style={checkStyles} icon={faCheck} />
                </When>
                <span style={textStyles}>{props.item.title}</span>
                <When condition={!props.item.completed}>
                    <StatusCircle required={props.item.required} />
                </When>
                <FontAwesomeIcon style={arrowStyles} icon={faArrowRightLong} />
            </button>
        </Link>
    );
};

export const AuthoringTab = () => {
    // Set default values
    const mandatorySectionTitles = ['Hero Banner', 'Summary', 'Details', 'Provide Feedback'];
    const optionalSectionTitles = ['View Results', 'Subscribe', 'More Engagements'];
    const feedbackTitles = ['Survey', '3rd Party Feedback Method Link'];
    const defaultAuthoringValue: AuthoringValue = {
        id: 0,
        title: '',
        link: '#',
        required: false,
        completed: false,
    };
    const getAuthoringValues = (
        defaultValues: AuthoringValue,
        titles: string[],
        required: boolean,
        idOffset = 0,
    ): AuthoringValue[] => {
        return titles.map((title, index) => ({
            ...defaultValues,
            title: title,
            required: required,
            id: index + idOffset,
        }));
    };
    const mandatorySectionValues = getAuthoringValues(defaultAuthoringValue, mandatorySectionTitles, true);
    const optionalSectionValues = getAuthoringValues(defaultAuthoringValue, optionalSectionTitles, false, 100);
    const defaultSectionValues = [...mandatorySectionValues, ...optionalSectionValues];
    const defaultFeedbackMethods = getAuthoringValues(defaultAuthoringValue, feedbackTitles, true, 1000);

    // Set useStates. When data is imported, it will be set with setSectionValues and setFeedbackMethods.
    const [sectionValues, setSectionValues] = useState(defaultSectionValues);
    const [feedbackMethods, setFeedbackMethods] = useState(defaultFeedbackMethods);
    const [requiredSectionsCompleted, setRequiredSectionsCompleted] = useState(false);
    const [feedbackCompleted, setFeedbackCompleted] = useState(false);

    // Define styles
    const systemMessageStyles = {
        marginBottom: '1.5rem',
    };
    const metHeaderStyles = {
        marginBottom: '1.5rem',
        fontSize: '1.2rem',
    };
    const metLabelStyles = {
        textTransform: 'uppercase',
        marginBottom: '1.1rem',
        fontSize: '0.9rem',
    };
    const anchorContainerStyles = {
        margin: '0 0 2.5rem 0',
        padding: '0',
    };

    // Listen to the sectionValues useState and update the boolean value that controls the presence of the "sections" incomplete message.
    useEffect(() => {
        if (true !== requiredSectionsCompleted && allRequiredItemsComplete(sectionValues)) {
            setRequiredSectionsCompleted(true);
        } else if (false !== requiredSectionsCompleted) {
            setRequiredSectionsCompleted(false);
        }
    }, [sectionValues]);

    // Listen to the feedbackMethods useState and update the boolean value that controls the presence of the "feedback" incomplete message.
    useEffect(() => {
        if (true !== feedbackCompleted && allRequiredItemsComplete(feedbackMethods)) {
            setFeedbackCompleted(true);
        } else if (false !== feedbackCompleted) {
            setRequiredSectionsCompleted(false);
        }
    }, [feedbackMethods]);

    // Check if all required items are completed.
    const allRequiredItemsComplete = (values: AuthoringValue[]) => {
        const itemChecklist = values.map((value) => {
            if (undefined === value.required || undefined === value.completed) {
                return false;
            }
            if (true === value.required) {
                return true === value.completed;
            } else {
                return true;
            }
        });
        return !itemChecklist.includes(false);
    };

    return (
        <Grid container id="admin-authoring-section" direction="column" maxWidth={'700px'}>
            <Header2 decorated>Authoring</Header2>
            <MetHeader3 style={metHeaderStyles}>Page Section Authoring</MetHeader3>
            <When condition={!requiredSectionsCompleted}>
                <SystemMessage sx={systemMessageStyles} status="error">
                    There are incomplete or missing sections of required content in your engagement. Please complete all
                    required content in all of the languages included in your engagement.
                </SystemMessage>
            </When>
            <Grid
                container
                direction="row"
                id="sections-container"
                sx={{
                    ...anchorContainerStyles,
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    columnGap: '5rem',
                    rowGap: '1.25rem',
                }}
            >
                <Grid item xs={12} md={6}>
                    <MetLabel sx={metLabelStyles}>Required Sections</MetLabel>
                    {sectionValues.map(
                        (section) => section.required && <AuthoringButton key={section.id} item={section} />,
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <MetLabel sx={metLabelStyles}>Optional Sections</MetLabel>
                    {sectionValues.map(
                        (section) => !section.required && <AuthoringButton key={section.id} item={section} />,
                    )}
                </Grid>
            </Grid>
            <Grid container direction="column" id="feedback-container" sx={{ ...anchorContainerStyles }}>
                <MetHeader3 style={metHeaderStyles}>Feedback Configuration</MetHeader3>
                <When condition={!feedbackCompleted}>
                    <SystemMessage sx={systemMessageStyles} status="error">
                        There are feedback methods included in your engagement that are incomplete. Please complete
                        configuration for all of the feedback methods included in your engagement.
                    </SystemMessage>
                </When>
                <MetLabel sx={metLabelStyles}>Feedback Methods</MetLabel>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    {feedbackMethods.map((method) => (
                        <AuthoringButton item={method} key={method.id} />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};
