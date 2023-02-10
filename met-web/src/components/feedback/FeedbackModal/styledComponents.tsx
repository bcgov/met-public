import { Button, Rating, styled } from '@mui/material';
import { BaseTheme } from 'styles/Theme';

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
    width: 105,
    height: '100%',
    ':focus': {
        borderColor: BaseTheme.palette.primary.dark,
    },
}));
