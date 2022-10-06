import React, { useContext, useState } from 'react';
import { Autocomplete, Grid, Stack, TextField } from '@mui/material';
import { ActionContext } from '../ActionContext';
import { MetLabel, SecondaryButton } from 'components/common';
import { WidgetContact } from '../types';

const WhoIsListeningForm = () => {
    const { handleWidgetDrawerTabValueChange } = useContext(ActionContext);
    const [selectedContact, setSelectedContact] = useState<WidgetContact | null>(null);

    const testContact = {
        id: 0,
        name: 'Mandy Ming',
        title: 'inspector',
        phoneNumber: '123-234-2345',
        email: 'mandy@gov.bc.ca',
        address: '123 Main St. Victoria, BC, V0V 1B1',
        bio: 'Mandy is always happy to answer your questions and...',
    };
    return (
        <Grid container item xs={12} alignItems="stretch" justifyContent={'flex-start'} spacing={1}>
            <Grid item xs={12}>
                <MetLabel>Select Existing Contact</MetLabel>
            </Grid>
            <Grid item xs={8}>
                <Autocomplete
                    id="contact-selector"
                    options={[testContact]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            inputProps={{ sx: { height: '1em' } }}
                        />
                    )}
                    getOptionLabel={(contact: WidgetContact) => contact.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, contact: WidgetContact | null) =>
                        setSelectedContact(contact)
                    }
                    // disabled={loadingContacts}
                />
            </Grid>
            <Grid item xs={4}>
                <SecondaryButton sx={{ height: '2em' }} fullWidth>
                    Add New Contact
                </SecondaryButton>
            </Grid>
        </Grid>
    );
};

export default WhoIsListeningForm;
