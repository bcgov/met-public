import React from 'react';
import { SvgIcon } from '@mui/material';

export const ForumIcon = ({ ...props }: { [prop: string]: unknown }) => {
    return (
        <SvgIcon width="72.696" height="69.501" viewBox="0 0 72.696 69.501" {...props}>
            <g fill="#458686" stroke="#fff" strokeWidth="2">
                <rect width="65" height="35" rx="10" stroke="none" />
                <rect x="1" y="1" width="63" height="33" rx="9" fill="none" />
            </g>
            <g transform="translate(72.696 69.501) rotate(180)">
                <g transform="translate(0 0)">
                    <g fill="#9be2df" stroke="#fff" strokeWidth="1">
                        <rect width="65" height="35" rx="10" stroke="none" />
                        <rect x="0.5" y="0.5" width="64" height="34" rx="9.5" fill="none" />
                    </g>
                    <path
                        d="M18.449,0s-7.276,32.853-7.82,20.193S0,.278,0,.278"
                        transform="translate(37.175 33.042)"
                        fill="#9be2df"
                    />
                </g>
            </g>
            <path
                d="M-22838.951-17532s-8.5,36.906-9.141,22.686-12.42-22.373-12.42-22.373"
                transform="translate(22893.012 17560.459)"
                fill="#458686"
            />
        </SvgIcon>
    );
};
