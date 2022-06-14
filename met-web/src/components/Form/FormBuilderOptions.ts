export const formioOptions = {
    builder: {
        //change to true to show advanced components section
        advanced: false,
        data: false,
        premium: false,
        layout: {
            components: {
                table: true,
            },
        },
        entryControls: {
            title: 'Basic Fields',
            weight: 20,
            components: {
                simpletextfield: true,
                simpletime: true,
                checkmatrix: true,
            },
        },
    },
};
