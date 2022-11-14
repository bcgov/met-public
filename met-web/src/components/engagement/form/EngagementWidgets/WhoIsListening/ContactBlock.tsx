import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import ContactInfoPaper from './ContactInfoPaper';
import update from 'immutability-helper';
import { Contact } from 'models/contact';
import { DragItem } from 'components/common/Dragndrop';

interface ContactBlockProps {
    addedContacts: Contact[];
    setAddedContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}
const ContactBlock = ({ addedContacts, setAddedContacts }: ContactBlockProps) => {
    const moveContact = useCallback((dragIndex: number, hoverIndex: number) => {
        setAddedContacts((prevContacts: Contact[]) =>
            update(prevContacts, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevContacts[dragIndex]],
                ],
            }),
        );
    }, []);

    const removeContact = (contactId: number) => {
        const newContacts = addedContacts.filter((addedContact) => addedContact.id !== contactId);
        setAddedContacts([...newContacts]);
    };

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            {addedContacts.map((addedContact, index) => {
                return (
                    <Grid key={`added-contact-${addedContact.id}`} item xs={12}>
                        <DragItem name="Contact" moveItem={moveContact} index={index}>
                            <ContactInfoPaper contact={addedContact} removeContact={removeContact} />
                        </DragItem>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ContactBlock;
