import {
    Grid,
    Paper,
    Tooltip,
    Chip,
    IconButton,
    Collapse,
    Avatar,
    Badge,
    Typography,
    Skeleton,
    Stack,
    Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    ExpandMore,
    DragIndicator,
    FormatQuote,
    EditAttributes,
    InsertDriveFile,
    FileCopy,
    FilterAlt,
    FilterAltOff,
} from '@mui/icons-material';
import React from 'react';
import { MetHeader4 } from 'components/common';
import { TaxonTypes } from './TaxonTypes';
import { TaxonCardProps } from './types';
import { Draggable, DraggableProvided } from '@hello-pangea/dnd';
import { MetadataFilterTypes } from './MetadataFilterTypes';

const DetailsRow = ({ name, icon, children }: { name: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const theme = useTheme();
    return (
        <>
            <Grid item flexBasis="100%">
                <Divider />
            </Grid>
            <Grid item flexBasis="2em">
                <Tooltip title={name} placement="top">
                    <Avatar
                        sx={{
                            backgroundColor: theme.palette.grey[600],
                        }}
                    >
                        {icon}
                    </Avatar>
                </Tooltip>
            </Grid>
            <Grid item flexBasis="calc(100% - 3em)" flexGrow={1}>
                {children}
            </Grid>
        </>
    );
};

export const TaxonCard: React.FC<TaxonCardProps> = ({ taxon, isExpanded, onExpand, isSelected, onSelect, index }) => {
    const theme = useTheme();
    const cardStyle = isSelected
        ? {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              border: `1px solid ${theme.palette.primary.dark}`,
          }
        : { border: '1px solid transparent' };

    const handleExpand = (clickEvent: React.MouseEvent<HTMLElement>) => {
        clickEvent.stopPropagation();
        onExpand(taxon);
    };

    const taxonType = TaxonTypes[taxon.data_type ?? 'text'];

    const taxonTypeIcon = () => {
        return (
            <Tooltip
                placement="top"
                title={`${taxonType.name} ${!taxon.one_per_engagement ? '(select multiple)' : ''}`}
            >
                <Badge
                    color="primary"
                    badgeContent="+"
                    invisible={!taxonType.supportsMulti || taxon.one_per_engagement}
                >
                    <Avatar
                        variant="rounded"
                        sx={{
                            backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.primary.light,
                        }}
                    >
                        <taxonType.icon />
                    </Avatar>
                </Badge>
            </Tooltip>
        );
    };

    return (
        <Draggable key={taxon.id} draggableId={taxon.id.toString()} index={index}>
            {(provided: DraggableProvided) => (
                <Grid
                    item
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    xs={12}
                    onClick={() => onSelect(taxon)}
                    component={Paper}
                    style={{
                        display: 'flex',
                        alignItems: 'center', // Center items vertically
                        padding: '10px',
                        width: '100%',
                        marginBottom: '1em',
                        cursor: 'pointer',
                        ...cardStyle,
                        ...provided.draggableProps.style,
                    }}
                    elevation={isSelected ? 3 : 1}
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    aria-label="A card representing a taxon in the engagement metadata."
                    role="gridcell"
                    id={`taxon-${taxon.id}`}
                >
                    <Grid item container xs alignItems="center" spacing={1}>
                        <Grid item>
                            <Tooltip color="error" title="Drag to reorganize" placement="top" id="drag-handle-tooltip">
                                <IconButton
                                    sx={{ cursor: 'grab', color: 'inherit' }}
                                    {...provided.dragHandleProps}
                                    size="small"
                                    aria-label="Drag to reorganize; press to select and edit this taxon."
                                    // this button doubles as a keyboard focus target for the card
                                >
                                    <DragIndicator />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>{taxonTypeIcon()}</Grid>
                        <Grid item sx={{ width: 'calc(100% - 9em)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <MetHeader4
                                sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    width: '100%',
                                    maxHeight: '1.5em',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {taxon.name}
                            </MetHeader4>
                        </Grid>
                        <Grid item>
                            <IconButton
                                sx={{
                                    transition: (theme) =>
                                        theme.transitions.create('transform', {
                                            duration: theme.transitions.duration.shortest,
                                        }),
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',

                                    color: 'inherit',
                                }}
                                size="small"
                                aria-label="expand"
                                onClick={handleExpand}
                                aria-expanded={isExpanded}
                                aria-controls={`taxon-${taxon.id}-content`}
                            >
                                <ExpandMore />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                            sx={{ pt: 1 }}
                            id={`taxon-${taxon.id}-content`}
                            aria-labelledby={`taxon-${taxon.id}`}
                            aria-hidden={!isExpanded}
                        >
                            <Grid container alignItems="center" spacing={1} flexWrap="wrap">
                                {/* Description */}
                                <DetailsRow name="Description" icon={<FormatQuote />}>
                                    <Typography
                                        variant="body2"
                                        pl={1}
                                        sx={{ fontStyle: 'italic', wordWrap: 'break-word' }}
                                    >
                                        {taxon.description || 'No description provided.'}
                                    </Typography>
                                </DetailsRow>

                                {/* Validation */}
                                <DetailsRow name="Validation" icon={<EditAttributes />}>
                                    <Typography variant="body1" pl={1}>
                                        {taxon.freeform
                                            ? `Any ${taxonType.name.toLowerCase()} value can be added to this field. `
                                            : 'Users must select from the following options:'}
                                    </Typography>
                                    {taxon.freeform && (taxon.preset_values?.length ?? 0) > 0 && (
                                        <Typography variant="body1" pl={1}>
                                            These preset values will be offered as suggestions:
                                        </Typography>
                                    )}
                                    {(taxon.preset_values?.length ?? 0) > 0 && (
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                            {taxon.preset_values?.map((chip) => (
                                                <Chip
                                                    key={chip}
                                                    label={chip}
                                                    color={isSelected ? 'primary' : 'default'}
                                                    size="small"
                                                    sx={{ margin: '2px' }}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </DetailsRow>

                                {/* Multi-select */}
                                <DetailsRow
                                    name="Multi-select"
                                    icon={taxon.one_per_engagement ? <InsertDriveFile /> : <FileCopy />}
                                >
                                    <Typography variant="body1" pl={1}>
                                        {taxon.one_per_engagement
                                            ? 'One value per engagement.'
                                            : 'Unlimited values per engagement.'}
                                    </Typography>
                                </DetailsRow>

                                {/* Filter Type */}
                                {Boolean(taxonType.supportedFilters) && (
                                    <DetailsRow
                                        name="Filter Type"
                                        icon={taxon.filter_type ? <FilterAlt /> : <FilterAltOff />}
                                    >
                                        <Typography variant="body1" pl={1}>
                                            {taxon.filter_type
                                                ? MetadataFilterTypes[taxon.filter_type].name
                                                : 'Engagements are not filtered by this field.'}
                                        </Typography>
                                        {taxon.filter_type && (
                                            <Typography variant="body1" pl={1}>
                                                {MetadataFilterTypes[taxon.filter_type].details}
                                            </Typography>
                                        )}
                                    </DetailsRow>
                                )}
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </Draggable>
    );
};

export default TaxonCard;

export const TaxonCardSkeleton: React.FC = () => {
    return (
        <Grid
            item
            mr={2}
            xs={12}
            component={Paper}
            style={{
                display: 'flex',
                boxSizing: 'border-box',
                alignItems: 'center', // Center items vertically
                padding: '10px',
                width: '100%',
                height: '62px',
                marginBottom: '1em',
            }}
            elevation={1}
        >
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%', p: 0.1 }}
            >
                <Grid item container xs alignItems="center" spacing={1}>
                    <Grid item>
                        <IconButton color="inherit" size="small">
                            <DragIndicator />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rectangular" width={40} height={40} />
                    </Grid>
                    <Grid item sx={{ width: 'calc(100% - 9em)' }}>
                        <Skeleton variant="text" width={Math.random() * 50 + 10 + '%'} />
                    </Grid>
                    <Grid item>
                        <IconButton color="inherit" size="small" aria-label="expand">
                            <ExpandMore />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
