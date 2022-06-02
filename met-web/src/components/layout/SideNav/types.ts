export interface DrawerBoxProps {
    navigate: (path: string) => void;
}

export interface SideNavProps {
    open: boolean;
    isMediumScreen: boolean;
    drawerWidth: number;
}
