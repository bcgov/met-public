import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/system';

export const EngagementFormTab = styled(Tab)(() => ({
    height: '0.5em',
    minHeight: 0,
}));

export const EngagementFormTabList = styled(TabList)(() => ({
    transition: 'none',
    '& button': { border: '1px solid transparent', borderBottom: 'none' },
    '& button.Mui-selected': { border: '1px solid #606060', borderBottom: 'none' },
    paddingLeft: '1em',
    minHeight: 0,
}));

export const EngagementFormTabPanel = styled(TabPanel)(() => ({
    padding: 0,
}));
