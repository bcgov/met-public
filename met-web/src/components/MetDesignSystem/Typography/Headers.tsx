import { styled } from '@mui/material';

export const Header1 = styled('h1')({
    lineHeight: '1.5',
    fontSize: '2rem',
    marginBottom: '2rem',
    marginTop: '1.5rem',
    fontWeight: 700,
    color: '#292929',
});

export const Header2 = styled('h2')<{ decorated?: boolean }>((props) => ({
    lineHeight: '1.5',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    marginTop: '0.5rem',
    fontWeight: 600,
    color: '#292929',
    '&::before': props.decorated
        ? {
              backgroundColor: '#FCBA19',
              content: '""',
              display: 'block',
              width: '40px',
              height: '4px',
              position: 'relative',
              bottom: '4px',
          }
        : {},
}));

const Headers = {
    Header1,
    Header2,
};

export default Headers;
