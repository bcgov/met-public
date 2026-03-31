export interface AuthoringValue {
    id: number;
    title: string;
    link: string;
    required: boolean;
    completed: boolean;
}

export interface StatusCircleProps {
    required: boolean;
}

export interface AuthoringButtonProps {
    item: AuthoringValue;
}
