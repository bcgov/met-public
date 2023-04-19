import React from 'react';
import { ButtonBase } from '@mui/material';
import { Palette } from 'styles/Theme';
import Icon from '@mui/material/Icon';

interface BadgeProps {
    children: React.ReactNode;
    onClick?: () => void;
}
export const ApprovedIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <ButtonBase onClick={onClick}>
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
                    minHeight: '1.8em',
                    minWidth: '2em',
                    width: 'fit-content',
                }}
            >
                {children}
            </Icon>
        </ButtonBase>
    );
};

export const NFRIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <ButtonBase onClick={onClick}>
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
                    minHeight: '1.8em',
                    minWidth: '2em',
                    width: 'fit-content',
                }}
            >
                {children}
            </Icon>
        </ButtonBase>
    );
};

export const RejectedIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <ButtonBase onClick={onClick}>
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
                    minHeight: '1.8em',
                    minWidth: '2em',
                    width: 'fit-content',
                    padding: 0,
                }}
            >
                {children}
            </Icon>
        </ButtonBase>
    );
};

export const NewIcon = ({ children, onClick }: BadgeProps) => {
    return (
        <ButtonBase onClick={onClick}>
            <Icon
                sx={{
                    border: `2px solid ${Palette.primary.main}`,
                    '&:hover': {
                        backgroundColor: Palette.primary.main,
                        color: 'white',
                        textDecoration: 'underline',
                    },
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '1.8em',
                    minWidth: '2em',
                    width: 'fit-content',
                    padding: 0,
                }}
            >
                {children}
            </Icon>
        </ButtonBase>
    );
};
