import { Button, Rating, styled } from '@mui/material';
import { BaseTheme } from 'styles/Theme';
import { colors } from '../../common';

export const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        opacity: '0.5',
    },
    textAlign: 'center',
}));

export const CommentTypeButton = styled(Button)(() => ({
    borderColor: BaseTheme.palette.divider,
    color: BaseTheme.palette.text.primary,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 3,
    marginRight: 1,
    marginLeft: 1,
    width: 135,
    height: '100%',
    ':focus': {
        boxShadow: `0 0 0 2px ${colors.focus.regular.outer}`,
        borderColor: `${colors.focus.regular.inner}`,
    },
    ':focus-visible': {
        borderColor: BaseTheme.palette.primary.dark,
        boxShadow: `0 0 0 2px ${colors.focus.regular.inner}, 0 0 0 4px ${colors.focus.regular.outer}`,
    },
}));
