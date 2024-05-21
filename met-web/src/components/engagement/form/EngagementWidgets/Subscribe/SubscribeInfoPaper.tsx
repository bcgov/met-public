import React, { useContext } from 'react';
import { MetLabel, MetParagraphOld, MetWidgetPaper } from 'components/common';
import { Grid, IconButton, useMediaQuery } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons/faGripDotsVertical';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { Case, Switch, When } from 'react-if';
import { SUBSCRIBE_TYPE, SubscribeForm } from 'models/subscription';
import { SubscribeContext } from './SubscribeContext';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

export interface SubscribeInfoPaperProps {
    subscribeForm: SubscribeForm;
    removeSubscribeForm: (_subscribeId: number) => void;
}

const SubscribeInfoPaper = ({ subscribeForm, removeSubscribeForm, ...rest }: SubscribeInfoPaperProps) => {
    const subscribeItem = subscribeForm.subscribe_items[0];
    const { setSubscribeOptionToEdit, handleSubscribeDrawerOpen } = useContext(SubscribeContext);
    const isMediumScreen = useMediaQuery('(max-width:1100px)');
    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <MetWidgetPaper elevation={1} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="inherit" aria-label="drag-indicator">
                        <FontAwesomeIcon icon={faGripDotsVertical} style={{ fontSize: '24px', margin: '0px 4px' }} />
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
                        <Switch>
                            <Case condition={subscribeForm.type === SUBSCRIBE_TYPE.EMAIL_LIST}>
                                <MetLabel>Email List</MetLabel>
                            </Case>
                            <Case condition={subscribeForm.type === SUBSCRIBE_TYPE.SIGN_UP}>
                                <MetLabel>Form Sign-up</MetLabel>
                            </Case>
                        </Switch>
                    </Grid>
                    <When condition={Boolean(subscribeItem.description)}>
                        <Grid item xs={isMediumScreen ? 4 : 3}>
                            <MetParagraphOld>Description:</MetParagraphOld>
                        </Grid>
                        <Grid
                            item
                            xs={isMediumScreen ? 8 : 9}
                            sx={{
                                position: 'relative',
                                height: 'auto',
                                marginTop: -1,
                            }}
                            style={{ paddingTop: 0 }}
                        >
                            <Editor
                                editorState={getEditorStateFromRaw(subscribeItem.rich_description || '')}
                                readOnly={true}
                                toolbarHidden
                            />
                        </Grid>
                    </When>

                    <Grid item xs={3}>
                        <MetParagraphOld>{capitalizeFirstLetter(subscribeItem.call_to_action_type)}:</MetParagraphOld>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {subscribeItem.call_to_action_text}
                        </MetParagraphOld>
                    </Grid>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton sx={{ padding: 1, margin: 0 }} color="inherit" aria-label="edit-icon">
                            <FontAwesomeIcon
                                icon={faPen}
                                style={{ fontSize: '22px' }}
                                onClick={() => {
                                    setSubscribeOptionToEdit(subscribeForm);
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
                            <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: '22px' }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default SubscribeInfoPaper;
