import React from 'react';
import { Button } from 'components/common/Input/Button';
import { Grid } from '@mui/material';
import { SubscribeForm, CallToActionType } from 'models/subscription';
import { When } from 'react-if';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Editor } from 'react-draft-wysiwyg';
import { Widget } from 'models/widget';
import { getBaseUrl } from 'helper';
import { Link } from 'components/common/Navigation';

const FormSignUpSection = ({ subscribeOption, widget }: { subscribeOption: SubscribeForm; widget: Widget }) => {
    const languagePath = `${sessionStorage.getItem('languageId')}`;
    const handleNavigate = () => {
        const baseUrl = getBaseUrl();
        window.open(`${baseUrl}/engagements/${widget.engagement_id}/cacform/${widget.id}/${languagePath}`, '_blank');
    };
    return (
        <Grid spacing={2} container item xs={12}>
            <Grid
                item
                xs={12}
                sx={{
                    position: 'relative',
                    height: 'auto',
                    marginTop: -1,
                }}
                style={{ paddingTop: 0 }}
            >
                <Editor
                    editorState={getEditorStateFromRaw(subscribeOption.subscribe_items[0].rich_description || '')}
                    readOnly={true}
                    toolbarHidden
                />
            </Grid>
            <Grid container item xs={12} justifyContent={'flex-end'}>
                <When condition={subscribeOption.subscribe_items[0].call_to_action_type == CallToActionType.BUTTON}>
                    <Grid container xs={12} direction="row" justifyContent="flex-end">
                        <Button variant="primary" size="small" onClick={handleNavigate}>
                            {subscribeOption.subscribe_items[0].call_to_action_text}
                        </Button>
                    </Grid>
                </When>
                <When condition={subscribeOption.subscribe_items[0].call_to_action_type == CallToActionType.LINK}>
                    <Grid container xs={12}>
                        <Link sx={{ cursor: 'pointer' }}>{subscribeOption.subscribe_items[0].call_to_action_text}</Link>
                    </Grid>
                </When>
            </Grid>
        </Grid>
    );
};

export default FormSignUpSection;
