import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/system';
import { Palette } from 'styles/Theme';

export const MetTab = styled(Tab)(() => ({
    height: '0.5em',
    minHeight: 0,
    border: '1px solid #cdcdcd',
    borderRadius: '0px',
    borderBottom: 'none',
    color: Palette.action.active,
    fontWeight: 'inherit',
    '&.Mui-selected': {
        border: '1px solid #606060',
        borderBottom: 'none',
        color: Palette.text.primary,
        fontWeight: '700',
    },
}));

export const MetTabList = styled(TabList)(() => ({
    transition: 'none',
    paddingLeft: '1em',
    minHeight: 0,
}));

export const MetTabPanel = styled(TabPanel)(() => ({
    padding: 0,
}));
