import React, { useEffect } from 'react';
import { Grid, FormControl, FormControlLabel, IconButton, Radio, RadioGroup } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { When } from 'react-if';
import { TextField, Button } from 'components/common/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/pro-regular-svg-icons';
import { BodyText } from 'components/common/Typography';
import { getBaseUrl } from 'helper';
import { colors } from 'styles/Theme';
import { Link } from 'components/common/Navigation';

const EngagementVisibilityControl = () => {
    const siteUrl = getBaseUrl();

    const engagementForm = useFormContext();
    const { control, watch, setValue } = engagementForm;

    const isInternal = watch('is_internal');
    const formSlug = watch('slug');

    const [isEditing, setIsEditing] = React.useState(false);
    const [currentSlug, setCurrentSlug] = React.useState(formSlug);
    const [isConfirmed, setIsConfirmed] = React.useState(false);
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
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    return (
        <>
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
                            aria-label="is_internal"
                            name="is_internal"
                        >
                            <FormControlLabel value={false} control={<Radio />} label="Public (unrestricted)" />
                            <FormControlLabel value={true} control={<Radio />} label="BC Gov (IDIR restricted)" />
                        </RadioGroup>
                    )}
                />
            </FormControl>
            <When condition={isInternal !== undefined}>
                <When condition={!isEditing}>
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        direction="column"
                        sx={{
                            border: '1px solid',
                            borderColor: 'primary.light',
                            borderRadius: '4px',
                            ml: 0,
                            mt: 2,
                            pb: 2,
                            pr: 2,
                            width: '100%',
                        }}
                    >
                        <Grid item container spacing={1} alignItems="center">
                            <Grid item>
                                <BodyText bold color="primary.light">
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
                                        <FontAwesomeIcon icon={faPencilAlt} />
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
                        <When condition={!isConfirmed}>
                            <Grid item container spacing={2} flexDirection="row" alignItems="center">
                                <Grid item>
                                    <Button variant="primary" onClick={() => setIsConfirmed(true)}>
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
                        </When>
                    </Grid>
                </When>

                <When condition={isEditing}>
                    <TextField
                        value={currentSlug}
                        onChange={setCurrentSlug}
                        title="Engagement URL"
                        startAdornment={
                            <BodyText bold sx={{ textWrap: 'nowrap', mr: '-8px' }}>
                                {siteUrl}/
                            </BodyText>
                        }
                    />
                    <Grid container spacing={2} mt={1} flexDirection="row" alignItems="center">
                        <Grid item>
                            <Button
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
            </When>
        </>
    );
};

export default EngagementVisibilityControl;
