import React from 'react';
import {
    Select as MuiSelect,
    SelectProps as MuiSelectProps,
    MenuItem,
    SelectChangeEvent,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles';
import { colors, elevations } from '../../common';
import { isDarkColor } from 'utils';

type CommonSelectProps = {
    options: Array<{ value: string | number; label: string }>;
    value: string | number;
    onChange: (event: SelectChangeEvent<unknown>) => void;
    id: string;
    renderValue: (value: unknown) => React.ReactNode;
    displayEmpty?: boolean;
    inputProps?: Record<string, unknown>;
    MenuProps?: Record<string, unknown>;
    color?: 'default' | 'danger' | 'warning' | 'success' | string;
};

export const CommonSelect: React.FC<CommonSelectProps & Omit<MuiSelectProps, 'value' | 'onChange' | 'renderValue'>> = ({
    options,
    value,
    onChange,
    id,
    renderValue,
    displayEmpty = false,
    inputProps = {},
    MenuProps = {},
    color = 'default',
    ...selectProps
}) => {
    const theme = useTheme();
    const customColor = colors.button[color as keyof typeof colors.button]?.shade ?? color;
    const bgColor = customColor;
    const darkBgColor = `color-mix(in srgb, ${bgColor}, black 20%)`;
    const textColors = isDarkColor(bgColor, 0.4) ? colors.type.inverted : colors.type.regular;

    return (
        <MuiSelect
            value={value}
            onChange={onChange}
            id={id}
            renderValue={renderValue}
            displayEmpty={displayEmpty}
            inputProps={{
                ...inputProps,
                'aria-label': inputProps['aria-label'] ?? '',
                style: { padding: 0, height: 48 },
            }}
            sx={{
                mr: 1,
                mb: 1.5,
                p: 1,
                height: 48,
                borderRadius: '2em',
                backgroundColor: bgColor,
                color: textColors.primary,
                boxShadow: 3,
                '&:hover': {
                    backgroundColor: darkBgColor,
                    boxShadow: elevations.hover,
                },
                '&.Mui-focused': {
                    backgroundColor: darkBgColor,
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${colors.focus.regular.inner}, 0 0 0 4px ${colors.focus.regular.outer}`,
                },
                '&:focus-visible': {
                    backgroundColor: darkBgColor,
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${colors.focus.regular.inner}, 0 0 0 4px ${colors.focus.regular.outer}`,
                },
                '&:active': {
                    backgroundColor: darkBgColor,
                },
                '& svg': {
                    color: 'white',
                },
            }}
            MenuProps={{
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
                transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                },
                sx: {
                    backgroundColor: 'transparent',
                    borderRadius: '8px',
                    boxShadow: 3,
                    mt: 1,
                    ml: -1,
                    '& .MuiPaper-root': {
                        borderRadius: '8px',
                        boxShadow: 3,
                        overflow: 'hidden',
                        border: '1px solid #D9D9D9',
                    },
                    '& ul': {
                        p: 0,
                        '& li': {
                            fontSize: '16px',
                            height: 48,
                            '&:hover': {
                                backgroundColor: '#ECEAE8',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#D8EAFD',
                            },
                            '& span': {
                                color: '#292929',
                            },
                            '&.Mui-selected span': {
                                fontWeight: 'bold',
                                color: theme.palette.primary.main,
                            },
                            '&:not(:first-of-type)': {
                                borderTop: '1px solid #D9D9D9',
                            },
                        },
                    },
                },
                ...MenuProps,
            }}
            {...selectProps}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {value === option.value && (
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faCheck} style={{ fontSize: '20px' }} />
                        </ListItemIcon>
                    )}
                    <ListItemText primary={option.label} />
                </MenuItem>
            ))}
        </MuiSelect>
    );
};
