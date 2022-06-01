export interface DrawerBoxProps {
    navigate: (path: string) => void;
    isMediumScreen: boolean;
}

export interface SideNavProps {
    open: boolean;
    isMediumScreen: boolean;
    drawerWidth: number;
}
