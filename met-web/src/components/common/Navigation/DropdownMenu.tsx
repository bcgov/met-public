import React, { useId, useRef, useState } from 'react';
import {
    ButtonBase,
    Grid,
    MenuList,
    Popper,
    ClickAwayListener,
    MenuListProps,
    ButtonBaseProps,
    PopperProps,
} from '@mui/material';
import TrapFocus from '@mui/base/TrapFocus';
import { colors } from 'styles/Theme';
import { BodyText } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { When, Unless } from 'react-if';
import { elevations } from 'components/common';

export const dropdownMenuStyles = {
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid transparent',
    '&:hover': { backgroundColor: colors.surface.blue[80] },
    '&:focus-visible': {
        backgroundColor: colors.surface.blue[80],
        border: '1px dashed white',
    },
};

export const DropdownMenu = ({
    name,
    buttonContent,
    buttonProps,
    children,
    popperProps,
    ...props
}: {
    name: string;
    buttonContent?: ({ isOpen }: { isOpen: boolean }) => React.ReactNode;
    buttonProps?: ButtonBaseProps;
    popperProps?: Partial<PopperProps>;
    children?: React.ReactNode;
} & MenuListProps) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownId = useId();

    return (
        <>
            {/* Dropdown Button */}
            <ButtonBase
                ref={buttonRef}
                aria-haspopup
                aria-controls={open ? dropdownId : undefined}
                aria-expanded={open}
                aria-label={name || 'Dropdown Menu'}
                onClick={() => {
                    setOpen(!open);
                }}
                {...buttonProps}
                sx={{
                    ...dropdownMenuStyles,
                    ...buttonProps?.sx,
                }}
            >
                {/* Pass the "open" state to the button contents in case they want to change based on dropdown state */}
                <Unless condition={buttonContent === undefined}>{buttonContent?.({ isOpen: open })}</Unless>
                {/* A basic button label if no custom content is provided */}
                <When condition={buttonContent === undefined}>
                    <Grid container direction="row" alignItems="center" spacing={1}>
                        <Grid item>
                            <BodyText sx={{ userSelect: 'none', textTransform: 'capitalize' }}>{name}</BodyText>
                        </Grid>
                        <Grid item hidden={!children}>
                            <FontAwesomeIcon color="white" icon={faChevronDown} rotation={open ? 180 : undefined} />
                        </Grid>
                    </Grid>
                </When>
            </ButtonBase>
            <ClickAwayListener
                mouseEvent="onMouseUp"
                onClickAway={(e) => {
                    if (e.target !== buttonRef.current && !buttonRef.current?.contains(e.target as Node))
                        setOpen(false);
                }}
            >
                {/* Dropdown Contents */}
                <Popper
                    onKeyDown={(e) => {
                        // listen for escape key to close menu
                        if (e.key === 'Escape') setOpen(false);
                    }}
                    id={dropdownId}
                    anchorEl={buttonRef.current}
                    placement="bottom-start"
                    modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
                    open={open}
                    {...popperProps}
                    sx={{
                        zIndex: 10000,
                        boxShadow: elevations.default,
                        backgroundColor: colors.surface.blue[90],
                        padding: '2px',
                        borderRadius: '16px',
                        minWidth: 'fit-content',
                        width: buttonRef.current && buttonRef.current.offsetWidth,
                        ...popperProps?.sx,
                    }}
                >
                    <TrapFocus open={open}>
                        <MenuList
                            sx={{ minWidth: 'fit-content' }}
                            aria-label={name || 'Dropdown Menu'}
                            tabIndex={-1}
                            aria-expanded={open}
                            autoFocusItem
                            {...props}
                        >
                            {children}
                        </MenuList>
                    </TrapFocus>
                </Popper>
            </ClickAwayListener>
        </>
    );
};
export default DropdownMenu;
