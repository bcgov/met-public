import { NotificationModalProps } from 'components/common/Modals/types';

export interface NotificationModalState {
    open: boolean;
    data: NotificationModalProps;
    type: string;
}
