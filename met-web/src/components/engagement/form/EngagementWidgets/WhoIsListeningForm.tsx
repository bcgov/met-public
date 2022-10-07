import React, { useContext, useState } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { ActionContext } from '../ActionContext';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { WidgetContact } from '../types';

const WhoIsListeningForm = () => {
    const { handleWidgetDrawerTabValueChange, handleWidgetDrawerOpen, handleAddContactDrawerOpen } =
        useContext(ActionContext);
    const [selectedContact, setSelectedContact] = useState<WidgetContact | null>(null);

    const testContact = {
        id: 0,
        name: 'Mandy Ming',
        role: 'inspector',
        phoneNumber: '123-234-2345',
        email: 'mandy@gov.bc.ca',
        address: '123 Main St. Victoria, BC, V0V 1B1',
        bio: 'Mandy is always happy to answer your questions and...',
    };
    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={1}>
            <Grid item xs={12}>
                <MetLabel>Select Existing Contact</MetLabel>
            </Grid>
            <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1}>
                <Grid item xs={4}>
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
                            />
                        )}
                        getOptionLabel={(contact: WidgetContact) => contact.name}
                        onChange={(_e: React.SyntheticEvent<Element, Event>, contact: WidgetContact | null) =>
                            setSelectedContact(contact)
                        }
                        // disabled={loadingContacts}
                    />
                </Grid>
                <Grid item>
                    <PrimaryButton sx={{ height: '100%' }} fullWidth>
                        Add existing contact
                    </PrimaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton sx={{ height: '100%' }} fullWidth onClick={() => handleAddContactDrawerOpen(true)}>
                        Create New Contact
                    </SecondaryButton>
                </Grid>
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <PrimaryButton>{`Save & Close`}</PrimaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default WhoIsListeningForm;
