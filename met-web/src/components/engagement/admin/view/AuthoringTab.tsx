import React, { useState, useEffect } from 'react';
import { AuthoringValue, AuthoringButtonProps, StatusCircleProps } from './types';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/pro-light-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { MetLabel, MetHeader3 } from 'components/common';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { Unless, When } from 'react-if';
import { Grid } from '@mui/material';
import { colors } from 'styles/Theme';
import { Link } from 'components/common/Navigation';
import { getDefaultAuthoringTabValues } from './AuthoringTabElements';

export const StatusCircle = (props: StatusCircleProps) => {
    const statusCircleStyles = {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: props.required ? colors.notification.danger.icon : colors.surface.gray[70],
        marginLeft: '0.3rem',
        display: 'inline-block',
        bottom: '0.5rem',
        position: 'relative' as const,
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
        <Link underline="none" style={{ ...buttonStyles }} to={props.item.link}>
            <When condition={props.item.completed}>
                <FontAwesomeIcon style={checkStyles} icon={faCheck} />
            </When>
            <span style={textStyles}>{props.item.title}</span>
            <Unless condition={props.item.completed}>
                <StatusCircle required={props.item.required} />
            </Unless>
            <FontAwesomeIcon style={arrowStyles} icon={faArrowRightLong} />
        </Link>
    );
};

export const AuthoringTab = () => {
    // Set useStates. When data is imported, it will be set with setSectionValues and setFeedbackMethods.
    const [sectionValues] = useState(getDefaultAuthoringTabValues('sections'));
    const [feedbackMethods] = useState(getDefaultAuthoringTabValues('feedback'));
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
                <SystemMessage sx={systemMessageStyles} status="danger">
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
                    <SystemMessage sx={systemMessageStyles} status="danger">
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

export default AuthoringTab;
