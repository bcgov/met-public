import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface SideNavProps {
    open: boolean;
    isMediumScreen: boolean;
    drawerWidth: number;
    setOpen: (open: boolean) => void;
}

export interface DrawerBoxProps {
    isMediumScreen: boolean;
    setOpen: (open: boolean) => void;
}

export interface IconAssignments {
    [k: string]: IconDefinition;
}

export interface CloseButtonProps {
    setOpen: (open: boolean) => void;
}
