import { styled } from '@mui/material';
import { globalFocusVisible, colors } from '../../common';
import { Link as RouterLink } from 'react-router-dom';

export const BodyText = styled('p')<{ bold?: boolean; small?: boolean }>(({ bold, small }) => ({
    margin: 0,
    lineHeight: small ? '1.375' : '1.5',
    fontSize: small ? '0.875rem' : '1rem',
    color: '#292929',
    fontWeight: bold ? 700 : 400,
}));

export const Link = styled(RouterLink)<{ bold?: boolean; small?: boolean }>(({ bold, small }) => ({
    textDecoration: 'none',
    lineHeight: small ? '1.375' : '1.5',
    fontSize: small ? '0.875rem' : '1rem',
    fontWeight: bold ? 700 : 400,
    color: colors.type.regular.link,
    '&:hover': {
        textDecoration: 'underline',
    },
    '&:focus': {
        ...globalFocusVisible,
    },
}));

const Body = {
    BodyText,
};

export default Body;
