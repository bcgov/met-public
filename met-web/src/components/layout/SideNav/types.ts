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
    Home: IconDefinition;
    Engagements: IconDefinition;
    Surveys: IconDefinition;
    Metadata: IconDefinition;
    Languages: IconDefinition;
    'User Admin': IconDefinition;
    'Tenant Admin': IconDefinition;
    'MET Feedback': IconDefinition;
}
