import { Button as MuiButton } from '@mui/material';
import styled from '@emotion/styled';

export const RoundedButton = styled(MuiButton)(() => ({
    borderRadius: '23px',
}));

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
