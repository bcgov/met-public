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
                // hiding category checkboxes
                categorycheckboxes: false,
                // hiding category comment container
                categorycommentcontainer: false,
                simplehtmlelement: true,
                simplecontent: true,
                simplesurvey: true,
                simpleselect: true,
            },
            default: true,
        },
    },
};
