export const formioOptions = {
    builder: {
        //change to true to show advanced components section
        advanced: false,
        data: false,
        premium: false,
        basic: false,
        layout: false,
        entryControls: {
            title: 'Basic Fields',
            weight: 20,
            components: {
                simpletextfield: true,
                simpletextarea: true,
                simpleradios: true,
                simplecheckboxes: true,
                header: true,
                paragraph: true,
            },
        },
    },
};
