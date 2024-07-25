export interface SideNavProps {
    open: boolean;
    isMediumScreen: boolean;
    drawerWidth: number;
    setOpen: (open: boolean) => void;
}

export interface DrawerBoxProps {
    isMediumScreenOrLarger: boolean;
    setOpen: (open: boolean) => void;
}

export interface CloseButtonProps {
    setOpen: (open: boolean) => void;
}
