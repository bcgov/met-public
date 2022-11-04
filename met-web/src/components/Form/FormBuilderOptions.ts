export const formioOptions = {
    noDefaultSubmitButton: true,
    builder: {
        //change to true to show advanced components section
        advanced: false,
        data: false,
        premium: false,
        basic: false,
        layout: false,
        custom: {
            title: 'Basic',
            weight: 20,
            components: {
                simpletextfield: true,
                simpletextarea: true,
                simpleradios: true,
                simplecheckboxes: true,
                header: true,
                paragraph: true,
                simplepostalcode: true,
                checkboxesvc: true,
                textareavc: true,
            },
            default: true,
        },
    },
};
