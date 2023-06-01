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
            title: '',
            weight: 20,
            components: {
                simpletextfield: true,
                simpletextarea: true,
                simpleradios: true,
                simplecheckboxes: true,
                header: true,
                paragraph: true,
                simplepostalcode: true,
                categorycheckboxes: true,
                categorycommentcontainer: true,
                simplehtmlelement: true,
                content: true,
                simplesurvey: true,
                simpleselect: true,
            },
            default: true,
        },
    },
};
