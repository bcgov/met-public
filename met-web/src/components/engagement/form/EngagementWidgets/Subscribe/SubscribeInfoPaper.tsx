import React, { useContext } from 'react';
import { MetParagraph, MetWidgetPaper } from 'components/common';
import { Grid, IconButton, useMediaQuery } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { When } from 'react-if';
import { SubscribeForm } from 'models/subscription';
import { SubscribeContext } from './SubscribeContext';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { styled } from '@mui/system';
import './RichEditorStyles.css';

const EditorGrid = styled(Grid)`
    padding-top: 0px !important;
`;

export interface SubscribeInfoPaperProps {
    subscribeForm: SubscribeForm;
    removeSubscribeForm: (_subscribeId: number) => void;
}

const SubscribeInfoPaper = ({ subscribeForm, removeSubscribeForm, ...rest }: SubscribeInfoPaperProps) => {
    const subscribeItem = subscribeForm.subscribe_items[0];
    const { setSubscribeToEdit, handleSubscribeDrawerOpen } = useContext(SubscribeContext);
    const isMediumScreen = useMediaQuery('(max-width:1100px)');
    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <MetWidgetPaper elevation={1} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="inherit" aria-label="drag-indicator">
                        <DragIndicatorIcon />
                    </IconButton>
                </Grid>
                <Grid
                    item
                    xs={9.5}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <Grid item xs={12}>
                        <MetParagraph fontWeight={'bold'}>Email List</MetParagraph>
                    </Grid>
                    <When condition={!!subscribeItem.description}>
                        <Grid item xs={isMediumScreen ? 4 : 3}>
                            <MetParagraph>Description:</MetParagraph>
                        </Grid>
                        <EditorGrid
                            item
                            xs={isMediumScreen ? 8 : 9}
                            sx={{
                                position: 'relative',
                                height: 'auto',
                                marginTop: -1,
                            }}
                        >
                            <div className="subscribe-editor-wrapper">
                                <Editor
                                    editorState={getEditorStateFromRaw(subscribeItem.description)}
                                    readOnly={true}
                                    toolbarHidden
                                />
                            </div>
                        </EditorGrid>
                    </When>

                    <Grid item xs={3}>
                        <MetParagraph>{capitalizeFirstLetter(subscribeItem.call_to_action_type)}:</MetParagraph>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {subscribeItem.call_to_action_text}
                        </MetParagraph>
                    </Grid>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton sx={{ padding: 1, margin: 0 }} color="inherit" aria-label="edit-icon">
                            <EditIcon
                                onClick={() => {
                                    setSubscribeToEdit(subscribeForm);
                                    handleSubscribeDrawerOpen(subscribeForm.type, true);
                                }}
                            />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton
                            onClick={() => removeSubscribeForm(subscribeForm.id)}
                            sx={{ padding: 1, margin: 0 }}
                            color="inherit"
                            aria-label="delete-icon"
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default SubscribeInfoPaper;
