import React, { useEffect } from 'react';
import { Grid, FormControl, FormControlLabel, IconButton, Radio, RadioGroup } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { Unless, When } from 'react-if';
import { TextField, Button } from 'components/common/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-regular-svg-icons';
import { BodyText } from 'components/common/Typography';
import { getBaseUrl } from 'helper';
import { colors } from 'styles/Theme';
import { Link } from 'components/common/Navigation';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { OutlineBox } from 'components/common/Layout';

const EngagementVisibilityControl = () => {
    const siteUrl = getBaseUrl();

    const engagementForm = useFormContext();
    const { control, watch, setValue } = engagementForm;

    const isInternal = watch('is_internal');
    const formSlug = watch('slug');
    const isConfirmed = watch('_visibilityConfirmed');
    const setIsConfirmed = (value: boolean) => setValue('_visibilityConfirmed', value);

    const [isEditing, setIsEditing] = React.useState(false);
    const [currentSlug, setCurrentSlug] = React.useState(formSlug);
    const [hasBeenEdited, setHasBeenEdited] = React.useState(false);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'name' && type === 'change' && !hasBeenEdited) {
                // Create a slug based on the name
                const newSlug = Array.from(value.name)
                    .map((value) => {
                        const stringValue = value as string;
                        if (/[a-zA-Z0-9]/.exec(stringValue)) {
                            return stringValue;
                        }
                        return '-';
                    })
                    .join('')
                    .toLowerCase();
                setValue('slug', newSlug);
                setCurrentSlug(newSlug);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, hasBeenEdited]);

    useEffect(() => {
        // When the user selects a visibility option and the name has not been edited, set isEditing to true immediately
        if (isInternal !== undefined && !hasBeenEdited) {
            setIsEditing(true);
        }
    }, [isInternal, hasBeenEdited]);

    return (
        <>
            <Unless condition={isEditing}>
                <FormControl>
                    <Controller
                        control={control}
                        name="is_internal"
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                onChange={(e) => {
                                    // Simulate an event object matching the onChange signature
                                    setIsConfirmed(false);
                                    field.onChange({ target: { value: e.target.value === 'true' } });
                                }}
                                aria-label="Visibility"
                            >
                                <FormControlLabel value={false} control={<Radio />} label="Public (unrestricted)" />
                                <FormControlLabel value={true} control={<Radio />} label="BC Gov (IDIR restricted)" />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
            </Unless>
            {/* Hide the URL settings until the user has selected a visibility option */}
            <Unless condition={isInternal == undefined}>
                <Unless condition={isEditing}>
                    <OutlineBox sx={{ maxWidth: '700px', marginTop: '1rem' }}>
                        <Grid
                            container
                            spacing={2}
                            alignItems="flex-start"
                            direction="column"
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Grid item container spacing={1} alignItems="center">
                                <Grid item>
                                    <BodyText bold color="primary.main">
                                        Engagement URL
                                    </BodyText>
                                </Grid>
                                <When condition={isConfirmed}>
                                    <Grid item>
                                        <IconButton
                                            size="small"
                                            onClick={() => setIsEditing(true)}
                                            sx={{ display: 'inline-block' }}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </IconButton>
                                    </Grid>
                                </When>
                            </Grid>
                            <Grid item>
                                <BodyText>
                                    <span style={{ fontWeight: 'bold' }}>{siteUrl}/</span>
                                    {formSlug || '???'}
                                </BodyText>
                            </Grid>
                            <Unless condition={isConfirmed}>
                                <Grid item container spacing={2} flexDirection="row" alignItems="center">
                                    <Grid item>
                                        <Button
                                            variant="primary"
                                            disabled={!watch('slug')}
                                            onClick={() => {
                                                setIsConfirmed(true);
                                                setHasBeenEdited(true);
                                                setValue('slug', currentSlug);
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            tabIndex={0}
                                            sx={{ cursor: 'pointer', color: colors.type.regular.primary }}
                                            onClick={() => {
                                                setCurrentSlug(formSlug);
                                                setIsEditing(true);
                                            }}
                                        >
                                            Edit URL
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Unless>
                        </Grid>
                    </OutlineBox>
                </Unless>

                <When condition={isEditing}>
                    <SystemMessage status="info" sx={{ fontSize: '14px' }}>
                        Editing your engagement page's URL can significantly impact its reach and success. Familiarizing
                        yourself with{' '}
                        <Link fontWeight="bold" size="small" sx={{ cursor: 'help' }}>
                            URL Best Practices
                        </Link>{' '}
                        before editing is recommended.
                    </SystemMessage>
                    <TextField
                        value={currentSlug}
                        onChange={setCurrentSlug}
                        title="Engagement URL"
                        placeholder="engagement-title"
                        formFieldProps={{
                            sx: { '& p.met-input-form-field-title': { mt: 2, fontSize: '14px' } },
                        }}
                        startAdornment={
                            <BodyText bold sx={{ textWrap: 'nowrap', mr: '-8px' }}>
                                {siteUrl}/
                            </BodyText>
                        }
                    />
                    <Grid container spacing={2} mt={1} flexDirection="row" alignItems="center">
                        <Grid item>
                            <Button
                                disabled={!currentSlug}
                                variant="primary"
                                onClick={() => {
                                    setValue('slug', currentSlug);
                                    setHasBeenEdited(true);
                                    setIsConfirmed(true);
                                    setIsEditing(false);
                                }}
                            >
                                Confirm
                            </Button>
                        </Grid>
                        <Grid item>
                            <Link
                                tabIndex={0}
                                sx={{ cursor: 'pointer', color: colors.type.regular.primary }}
                                onClick={() => {
                                    setCurrentSlug(formSlug);
                                    setIsEditing(false);
                                }}
                            >
                                Cancel
                            </Link>
                        </Grid>
                    </Grid>
                </When>
            </Unless>
        </>
    );
};

export default EngagementVisibilityControl;
