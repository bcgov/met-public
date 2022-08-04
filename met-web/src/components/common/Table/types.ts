export interface HeadCell<T> {
    disablePadding: boolean;
    key: keyof T;
    label: string;
    numeric: boolean;
    allowSort: boolean;
    getValue?: (row: T) => string | number | JSX.Element;
    customStyle?: React.CSSProperties;
}
