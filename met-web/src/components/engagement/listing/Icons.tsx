import React from 'react';
import { IconButton } from '@mui/material';
import { Palette } from 'styles/Theme';
import Icon from '@mui/material/Icon';

interface BadgeProps {
    children: React.ReactNode;
    onClick?: () => void;
}
export const ApprovedIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <IconButton
            size="small"
            color="inherit"
            onClick={onClick}
            sx={{
                padding: 0,
            }}
        >
            <Icon
                sx={{
                    backgroundColor: '#D3FDC6',
                    '&:hover': {
                        backgroundColor: '#77eb52',
                    },
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '1.4em',
                    minWidth: '1.4em',
                    width: 'fit-content',
                }}
            >
                {children}
            </Icon>
        </IconButton>
    );
};

export const NFRIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <IconButton
            size="small"
            color="inherit"
            onClick={onClick}
            sx={{
                padding: 0,
            }}
        >
            <Icon
                sx={{
                    backgroundColor: '#FCE0B9',
                    '&:hover': {
                        backgroundColor: 'rgb(252, 185, 47)',
                    },
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '1.4em',
                    minWidth: '1.4em',
                    width: 'fit-content',
                }}
            >
                {children}
            </Icon>
        </IconButton>
    );
};

export const RejectedIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <IconButton
            size="small"
            color="inherit"
            onClick={onClick}
            sx={{
                padding: 0,
            }}
        >
            <Icon
                sx={{
                    backgroundColor: '#F9D9D9',
                    '&:hover': {
                        backgroundColor: 'rgb(241, 90, 44)',
                    },
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '1.4em',
                    minWidth: '1.4em',
                    width: 'fit-content',
                    padding: 0,
                }}
            >
                {children}
            </Icon>
        </IconButton>
    );
};

export const NewIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <IconButton
            size="small"
            color="inherit"
            onClick={onClick}
            sx={{
                padding: 0,
            }}
        >
            <Icon
                sx={{
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '1.4em',
                    minWidth: '1.4em',
                    width: 'fit-content',
                    border: `2px solid ${Palette.primary.main}`,
                    padding: 0,
                    '&:hover': {
                        backgroundColor: Palette.primary.main,
                        color: 'white',
                        textDecoration: 'underline',
                    },
                }}
            >
                {children}
            </Icon>
        </IconButton>
    );
};
