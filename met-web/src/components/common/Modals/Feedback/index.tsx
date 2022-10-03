import { Button, Rating, styled } from '@mui/material';
import { BaseTheme } from 'styles/Theme';

export const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        opacity: '0.5',
    },
    textAlign: 'center',
    direction: 'rtl',
}));

export const CommentTypeButton = styled(Button)(() => ({
    borderColor: BaseTheme.palette.divider,
    color: BaseTheme.palette.text.primary,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 3,
    paddingBottom: 5,
    marginRight: 2,
    marginLeft: 2,
    width: 105,
    ':focus': {
        borderColor: BaseTheme.palette.primary.dark,
    },
}));
