declare module '*.svg' {
    import * as React from 'react';
    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module '@types/arcgis-core';

declare module '*.png' {
    const value: string;
    export default value;
}
