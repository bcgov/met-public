import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { Link } from '@mui/material';
import { IconButton } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';

export interface EAProcessProps {
    backgroundColor: string;
    headerText: string;
    overlayText: string;
}

function EAProcess({ backgroundColor, headerText, overlayText }: EAProcessProps) {
    return (
        <Paper sx={{ backgroundColor: backgroundColor }}>
            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{headerText}</Typography>
            <Link sx={{ color: 'white' }}>Learn More</Link>
            <IconButton>
                <ForumIcon></ForumIcon>
            </IconButton>
        </Paper>
    );
}

export default EAProcess;
