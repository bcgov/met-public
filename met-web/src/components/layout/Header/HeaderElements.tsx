import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Row, Column } from '../../common';
//styles
export const sxLight = {
    color: '#494949',
    backgroundColor: '#f2f2f2',
    boxShadow: '0px 5px 9px #29',
};

export const headerSx = {
    zIndex: (theme:any) => theme.zIndex.drawer + 1,
    color: '#494949',
    backgroundColor: '#f2f2f2',
    boxShadow: '0px 5px 9px #29',
};

export const PageContainer = styled(Row)``;

export const LogoContainer = styled(Row)`
    flex: 1;
    margin-left: 20px;
    height: 70%;
    width: 100%;
    align-self: center;
`;

export const TitleContainer = styled(Row)`
    flex: 3;
    justify-content: flex-start;
`;

export const LogoutContainer = styled(Row)`
    flex: 1;
`;

export const AuthButton = styled(Button)`
    margin-right: 10px;
`;

export const HeaderText = styled(Typography)`
    font-size: 5vh;
    margin-left: 20px;
    font-weight: bold;
    color: #494949;
`;

export const buttonClass = 'btn btn-lg btn-warning';
