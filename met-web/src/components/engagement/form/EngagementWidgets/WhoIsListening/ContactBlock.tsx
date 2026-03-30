import React, { useContext } from 'react';
import { Grid2 as Grid } from '@mui/material';
import ContactInfoPaper from './ContactInfoPaper';
import { Contact } from 'models/contact';
import { WhoIsListeningContext } from './WhoIsListeningContext';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { DraggableBox, DroppableBox } from 'components/common/Dragdrop';
import { reorder } from 'utils';

const ContactBlock = () => {
    const { addedContacts, setAddedContacts } = useContext(WhoIsListeningContext);

    const moveContact = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(addedContacts, result.source.index, result.destination.index);

        setAddedContacts(items);
    };

    const removeContact = (contactId: number) => {
        const newContacts = addedContacts.filter((addedContact) => addedContact.id !== contactId);
        setAddedContacts([...newContacts]);
    };

    return (
        <DragDropContext onDragEnd={moveContact}>
            <DroppableBox droppableId="droppable">
                <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                    {addedContacts.map((addedContact: Contact, index) => {
                        return (
                            <Grid size={12} key={`Grid-${addedContact.id}`}>
                                <DraggableBox draggableId={String(addedContact.id)} index={index}>
                                    <ContactInfoPaper contact={addedContact} removeContact={removeContact} />
                                </DraggableBox>
                            </Grid>
                        );
                    })}
                </Grid>
            </DroppableBox>
        </DragDropContext>
    );
};

export default ContactBlock;
