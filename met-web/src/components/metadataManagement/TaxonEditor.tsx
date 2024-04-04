import { Grid, Box, Paper, IconButton, Modal, Button, Typography, Chip, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Close, UnfoldMore, UnfoldLess, AddCircle, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { reorder } from 'utils';
import { MetadataTaxon } from 'models/engagement';
import { MetDroppable } from 'components/common/Dragdrop';
import { ActionContext } from './ActionContext';
import TaxonEditForm from './TaxonEditForm';
import { Else, If, Then } from 'react-if';
import { TaxonCard, TaxonCardSkeleton } from './TaxonCard';

export const TaxonEditor = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const { metadataTaxa, reorderMetadataTaxa, createMetadataTaxon, selectedTaxon, setSelectedTaxonId, isLoading } =
        useContext(ActionContext);
    const orderedMetadataTaxa = useMemo(() => metadataTaxa, [metadataTaxa]);
    const [expandedCards, setExpandedCards] = useState<boolean[]>(new Array(metadataTaxa.length).fill(false));

    const setCardExpanded = (index: number, state: boolean) => {
        setExpandedCards((prevExpandedCards) => {
            const newExpandedCards = [...prevExpandedCards]; // create a copy
            newExpandedCards[index] = state; // update the copy
            return newExpandedCards; // return the updated copy
        });
    };

    const expandAll = () => {
        setExpandedCards(new Array(metadataTaxa.length).fill(true));
    };

    const collapseAll = () => {
        setExpandedCards(new Array(metadataTaxa.length).fill(false));
        setSelectedTaxonId(-1);
    };

    const repositionTaxon = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(metadataTaxa, result.source.index, result.destination.index);
        reorderMetadataTaxa(items.map((taxon) => taxon.id));
    };

    const handleSelectTaxon = (taxon: MetadataTaxon) => {
        if (taxon.id === selectedTaxon?.id) {
            setSelectedTaxonId(-1);
        } else {
            setSelectedTaxonId(taxon.id);
        }
    };

    const handleExpandTaxon = (taxon: MetadataTaxon) => {
        const index = orderedMetadataTaxa.findIndex((t) => t.id === taxon.id);
        if (index === -1) {
            return;
        }
        setCardExpanded(index, !expandedCards[index]);
    };

    const addTaxon = async () => {
        const newTaxon = await createMetadataTaxon({
            name: 'New Taxon',
            data_type: 'text',
            freeform: true,
            one_per_engagement: true,
        });
        if (newTaxon) {
            setSelectedTaxonId(newTaxon.id);
        }
        setTimeout(() => {
            scrollableRef.current?.scrollTo({ top: scrollableRef.current?.scrollHeight, behavior: 'smooth' });
        }, 1); // Wait for the new taxon to be rendered before scrolling
    };

    const [showScrollIndicators, setShowScrollIndicators] = useState({
        top: false,
        bottom: false,
    });

    const scrollableRef = useRef<HTMLDivElement>(null);

    const checkScroll = useCallback(() => {
        if (!scrollableRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
        const scrollMargin = 20;
        setShowScrollIndicators({
            top: scrollTop > scrollMargin,
            bottom: scrollTop < scrollHeight - clientHeight - scrollMargin,
        });
    }, []);

    useEffect(() => {
        const currentRef = scrollableRef.current;
        if (!currentRef) return;
        currentRef.addEventListener('scroll', checkScroll);
        // Initial check
        checkScroll();

        return () => currentRef.removeEventListener('scroll', checkScroll);
    }, [checkScroll]);

    useEffect(() => {
        // Call checkScroll with a delay after any expansion/collapse animation completes
        const timer = setTimeout(() => {
            checkScroll();
        }, 300);

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or if expandedCards changes again before the timer fires
    }, [expandedCards, checkScroll]); // Depend on expandedCards and checkScroll

    const scroll = (amount: number) => {
        const scrollableDiv = scrollableRef.current;
        if (scrollableDiv) {
            scrollableDiv.scrollBy({ top: amount, behavior: 'smooth' });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 100px)', // Adjust for the header height
                minHeight: '600px', // Prevents the component from collapsing
            }}
        >
            <Box sx={{ padding: '2.1em', width: '100%' }}>
                <Typography variant="subtitle1" color="textSecondary">
                    Manage the ways metadata is collected and organized for your engagements.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={expandAll}
                    sx={{
                        margin: '0.5em',
                        // visually lift the button when focused by keyboard
                        ':focus-visible': {
                            boxShadow: 3,
                        },
                    }}
                    aria-label="Expand All Taxon Cards"
                >
                    <UnfoldMore />
                    Expand All
                </Button>
                <Button
                    variant="outlined"
                    onClick={collapseAll}
                    aria-label="Collapse All Taxon Cards"
                    sx={{
                        margin: '0.5em',
                        ':focus-visible': {
                            boxShadow: 3,
                        },
                    }}
                >
                    <UnfoldLess />
                    Collapse All
                </Button>
                <Button variant="contained" onClick={addTaxon} sx={{ margin: '0.5em' }}>
                    <AddCircle />
                    Add Taxon
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    overflow: 'hidden', // Prevents overflow of child components
                }}
            >
                <Paper
                    sx={{
                        width: isSmallScreen ? '100%' : '50%',
                        padding: '1em',
                        // Distinguish from child components
                        margin: '1em',
                        backgroundColor: '#f5f5f5',
                    }}
                    elevation={3}
                >
                    <Fade in={showScrollIndicators.top} timeout={300}>
                        <Box
                            sx={{
                                width: '100%',
                                textAlign: 'center',
                                background: 'linear-gradient(#f5f5f5ff, #f5f5f500 100%)',
                                height: '3em',
                                marginBottom: '-3em',
                                position: 'relative',
                                zIndex: 10,
                            }}
                        >
                            <Chip
                                variant="filled"
                                color="secondary"
                                label="Scroll for more"
                                icon={<KeyboardArrowUp />}
                                onClick={() => {
                                    scroll(-400);
                                }}
                            />
                        </Box>
                    </Fade>
                    <Box
                        sx={{
                            height: '100%',
                            // Enable vertical scrolling
                            overflowY: 'scroll',
                            // Don't hide the scrollbar
                            scrollbarWidth: 'thin',
                            scrollbarColor: `${theme.palette.primary.main} #f5f5f5`,
                            '&::-webkit-scrollbar': {
                                width: '12px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.primary.main,
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                        ref={scrollableRef}
                    >
                        <DragDropContext onDragEnd={repositionTaxon}>
                            <MetDroppable droppableId="metadataTaxa">
                                <Grid container direction="column" width={'100%'} pr={1.5}>
                                    {!isLoading &&
                                        orderedMetadataTaxa.map((taxon: MetadataTaxon, index) => {
                                            return (
                                                <TaxonCard
                                                    key={taxon.id}
                                                    taxon={taxon}
                                                    index={index}
                                                    onExpand={handleExpandTaxon}
                                                    onSelect={handleSelectTaxon}
                                                    isSelected={taxon.id === selectedTaxon?.id}
                                                    isExpanded={expandedCards[index]}
                                                />
                                            );
                                        })}
                                    {isLoading && [...Array(8)].map(() => <TaxonCardSkeleton />)}
                                    {!isLoading && orderedMetadataTaxa.length === 0 && (
                                        <>
                                            <Typography variant="h6" color="textSecondary" align="center">
                                                No taxa found
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" align="center">
                                                Add a new taxon above to get started.
                                            </Typography>
                                        </>
                                    )}
                                </Grid>
                            </MetDroppable>
                        </DragDropContext>
                    </Box>
                    <Fade in={showScrollIndicators.bottom} timeout={300}>
                        <Box
                            sx={{
                                width: '100%',
                                textAlign: 'center',
                                background: 'linear-gradient(#f5f5f500, #f5f5f5ff 100%)',
                                height: '3em',
                                marginTop: '-3em',
                                paddingTop: '1em',
                                position: 'relative',
                                zIndex: 10,
                            }}
                        >
                            <Chip
                                variant="filled"
                                color="secondary"
                                label="Scroll for more"
                                icon={<KeyboardArrowDown />}
                                onClick={() => {
                                    scroll(400);
                                }}
                            />
                        </Box>
                    </Fade>
                </Paper>
                <If condition={isSmallScreen}>
                    <Then>
                        {selectedTaxon && (
                            <Modal open={true} onClose={() => setSelectedTaxonId(-1)}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        p: 4,
                                        paddingTop: '0',
                                        width: '80%',
                                        maxWidth: '40em',
                                        minWidth: '320px',
                                        maxHeight: '90vh',
                                        overflowY: 'scroll',
                                    }}
                                >
                                    <IconButton
                                        onClick={() => setSelectedTaxonId(-1)}
                                        sx={{
                                            position: 'relative',
                                            left: '-1em',
                                            top: '0.3em',
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                    <TaxonEditForm taxon={selectedTaxon} />
                                </Box>
                            </Modal>
                        )}
                    </Then>
                    <Else>
                        {selectedTaxon && (
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    padding: '1em',
                                }}
                            >
                                <Paper
                                    sx={{
                                        padding: '1rem',
                                        height: '100%',
                                        // Enable vertical scrolling
                                        overflowY: 'scroll',
                                        // Don't hide the scrollbar
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: `${theme.palette.primary.main} #f5f5f5`,
                                        '&::-webkit-scrollbar': {
                                            width: '12px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: theme.palette.primary.main,
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                    }}
                                >
                                    <TaxonEditForm taxon={selectedTaxon} />
                                </Paper>
                            </Box>
                        )}
                    </Else>
                </If>
            </Box>
        </Box>
    );
};
