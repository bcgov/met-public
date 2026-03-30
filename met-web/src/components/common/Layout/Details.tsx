import { Grid2 as Grid, Grid2Props as GridProps } from '@mui/material';
import React from 'react';

/**
 * A container component for displaying details in a layout.
 * It is designed to be used for displaying detailed information in a structured format.
 * The component supports additional styling through the `sx` prop.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display within the details container.
 * @param {GridProps} [props.formContainerProps] - Additional properties for the Box component.
 * @returns {JSX.Element} A styled Box component that serves as a details container.
 * @example
 * <DetailsContainer>
 *    <Detail>Detail 1</Detail>
 *    <Detail>Detail 2</Detail>
 * </DetailsContainer>
 * */
export const DetailsContainer = ({ children, ...formContainerProps }: GridProps) => {
    return (
        <Grid
            // Set as a container unless explicitly disabled
            container={formContainerProps.container === false ? false : true}
            size={12}
            className="dep-layout-details-container"
            padding={{ xs: 2, sm: 4 }}
            direction="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="gray.10"
            gap={3}
            {...formContainerProps}
        >
            {children}
        </Grid>
    );
};

/**
 * A component that displays a detail section within a layout.
 * It is designed to be used for displaying detailed information in a structured format.
 * The component supports an optional `invisible` prop to control whether the background is visible or transparent.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display within the detail section.
 * @param {boolean} [props.invisible=false] - If true, the background will be transparent; otherwise, it will be white.
 * @param {GridProps} [props.containerProps] - Additional properties for the Box component.
 * @returns {JSX.Element} A styled Box component that serves as a detail section.
 * @example
 * <Detail invisible={false}>
 *     <h2>Detail Title</h2>
 *     <p>This is some detailed information.</p>
 * </Detail>
 */
export const Detail = ({ children, invisible, ...containerProps }: { invisible?: boolean } & GridProps) => {
    return (
        <Grid
            size={12}
            // Set as a container unless explicitly disabled
            container={containerProps.container === false ? false : true}
            className="dep-layout-detail"
            direction="column"
            padding={2}
            rowSpacing={1}
            gap={1}
            alignItems="flex-start"
            alignSelf="stretch"
            borderRadius={0.5}
            bgcolor={invisible ? 'transparent' : 'background.paper'}
            {...containerProps}
        >
            {children}
        </Grid>
    );
};
