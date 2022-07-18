import React, { useState, useEffect } from 'react';
import { Grid, Button, Modal, Box, Typography, TextField, Checkbox } from '@mui/material';
import SuccessModal from './SuccessModal';
import FailureModal from './FailureModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
};

function EmailModal(props: any) {
    function checkEmail(emailString: string) {
        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(emailString)) {
            // alert('Please provide a valid email address');
            setEmailVerify(false);
            setOpen(true);
        } else {
            setEmailVerify(true);
            setOpen(true);
        }
    }

    function handleClose() {
        setOpen(false);
        setEmailVerify(false);
        props.handleClose();
    }

    const [open, setOpen] = useState(false);
    const [emailVerify, setEmailVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        console.log(email);
    }, [email]);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        height="100%"
                        width="100%"
                    >
                        <Grid item xs={12} sx={{ p: 2 }}>
                            <Typography
                                id="modal-modal-title"
                                variant="h4"
                                component="h2"
                                sx={{ mb: 3, fontWeight: 'bold' }}
                            >
                                Verify your email address
                            </Typography>
                            <Typography id="modal-modal-header" sx={{ mb: 1 }}>
                                To provide you with the best experience possible. We require you to validate your email
                                address.
                            </Typography>
                            <Box>
                                <Typography sx={{ mb: 1 }}>
                                    You will receive a link to access the survey at the email address you provide.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ p: 1 }}>
                            <Typography sx={{ p: 1, fontWeight: 'bold' }}>Email address</Typography>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                id="outlined-basic"
                                label="Outlined"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            container
                            direction="row"
                            width="100%"
                            xs={12}
                            alignItems="center"
                            justifyContent="flex-start"
                            sx={{ p: 1 }}
                        >
                            <Checkbox
                                onChange={(event) => {
                                    setChecked(event.target.checked);
                                }}
                                {...label}
                            />
                            <Typography>I agree to the Terms and Conditions below.</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ pt: 1, pb: 1, borderLeft: 8, borderColor: '#003366' }}>
                            <Typography paragraph={true} id="modal-modal-description" sx={{ pl: 1 }}>
                                "On the other hand, we denounce with righteous indignation and dislike men who are so
                                beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire,
                                that they cannot foresee the pain and trouble that are bound to ensue; and equal blame
                                belongs to those who fail in their duty through weakness of will, which is the same as
                                saying through shrinking from toil and pain.
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            container
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="flex-end"
                            width="100%"
                            xs={12}
                        >
                            <Button variant="outlined" onClick={props.handleClose} sx={{ m: 1 }}>
                                Cancel
                            </Button>
                            <Button onClick={() => checkEmail(email)} variant={'contained'} sx={{ m: 1 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                    {emailVerify && open ? (
                        <>
                            <SuccessModal open={open} handleClose={handleClose} email={email} />
                        </>
                    ) : (
                        <>
                            <FailureModal
                                tryAgain={() => setOpen(false)}
                                open={open}
                                handleClose={handleClose}
                                email={email}
                            />
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default EmailModal;
