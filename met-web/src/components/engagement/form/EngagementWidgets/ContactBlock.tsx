import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import { Contact } from 'models/contact';
import ContantInfoPaper from './ContactInfoPaper';
import update from 'immutability-helper';
import DragItem from 'components/common/dragndrop/DragItem';

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

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            {addedContacts.map((addedContact, index) => {
                return (
                    <Grid key={`added-contact-${addedContact.id}`} item xs={12}>
                        <DragItem moveItem={moveContact} index={index}>
                            <ContantInfoPaper contact={addedContact} />
                        </DragItem>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ContactBlock;
