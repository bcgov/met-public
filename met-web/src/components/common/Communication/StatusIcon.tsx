import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle,
    faExclamationTriangle,
    faExclamationCircle,
    faCheckCircle,
} from '@fortawesome/pro-solid-svg-icons';
import {
    faInfoCircle as faInfoCircleRegular,
    faExclamationTriangle as faExclamationTriangleRegular,
    faExclamationCircle as faExclamationCircleRegular,
    faCheckCircle as faCheckCircleRegular,
} from '@fortawesome/pro-regular-svg-icons';
import {
    faCheckCircle as faCheckCircleLight,
    faExclamationCircle as faExclamationCircleLight,
    faExclamationTriangle as faExclamationTriangleLight,
    faInfoCircle as faInfoCircleLight,
} from '@fortawesome/pro-light-svg-icons';

import { colors } from 'styles/Theme';

type IconWeight = 'solid' | 'regular' | 'light';

/**
 * A component that displays an icon representing the status of a process or notification.
 * It uses FontAwesome icons to visually indicate success, warning, danger, or info statuses.
 * @param {Partial<FontAwesomeIconProps>} [props] - Additional properties for the FontAwesomeIcon component.
 * @param {string} props.status - The status to represent, can be 'success', 'warning', 'danger', or 'info'.
 * @param {string} props.color - Optional color for the icon, defaults to the theme's notification color for the given status.
 * @param {IconWeight} [props.weight='regular'] - The weight of the icon, can be 'solid', 'regular', or 'light'.
 */
export const StatusIcon = ({
    status,
    color,
    weight = 'regular',
    ...props
}: {
    status: 'success' | 'warning' | 'danger' | 'info';
    color?: string;
    weight?: IconWeight;
} & Partial<FontAwesomeIconProps>) => {
    let iconMap = {
        success: faCheckCircle,
        warning: faExclamationTriangle,
        danger: faExclamationCircle,
        info: faInfoCircle,
    };
    if (weight === 'regular') {
        iconMap = {
            success: faCheckCircleRegular,
            warning: faExclamationTriangleRegular,
            danger: faExclamationCircleRegular,
            info: faInfoCircleRegular,
        };
    }
    if (weight === 'light') {
        iconMap = {
            success: faCheckCircleLight,
            warning: faExclamationTriangleLight,
            danger: faExclamationCircleLight,
            info: faInfoCircleLight,
        };
    }

    return <FontAwesomeIcon icon={iconMap[status]} color={color ?? colors.notification[status].icon} {...props} />;
};
