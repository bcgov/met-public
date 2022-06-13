const defaultEditFormComponentsIgnored = [
    {
        key: 'labelPosition',
        ignore: true,
    },
    {
        key: 'placeholder',
        ignore: true,
    },
    {
        key: 'description',
        ignore: true,
    },
    {
        key: 'tooltip',
        ignore: true,
    },
    {
        key: 'widget.type',
        ignore: true,
    },
    {
        key: 'inputMask',
        ignore: true,
    },
    {
        key: 'displayMask',
        ignore: true,
    },
    {
        key: 'allowMultipleMasks',
        ignore: true,
    },
    {
        key: 'customClass',
        ignore: true,
    },
    {
        key: 'tabindex',
        ignore: true,
    },
    {
        key: 'autocomplete',
        ignore: true,
    },
    {
        key: 'prefix',
        ignore: true,
    },
    {
        key: 'suffix',
        ignore: true,
    },
    {
        key: 'hidden',
        ignore: true,
    },
    {
        key: 'hideLabel',
        ignore: true,
    },
    {
        key: 'showWordCount',
        ignore: true,
    },
    {
        key: 'showCharCount',
        ignore: true,
    },
    {
        key: 'mask',
        ignore: true,
    },
    {
        key: 'autofocus',
        ignore: true,
    },
    {
        key: 'spellcheck',
        ignore: true,
    },
    {
        key: 'disabled',
        ignore: true,
    },
    {
        key: 'tableView',
        ignore: true,
    },
    {
        key: 'modalEdit',
        ignore: true,
    },
];

export const formioOptions = {
    builder: {
        //change to true to show advanced components section
        data: false,
        advanced: {
            title: 'Advanced Fields2',
            weight: 40,
            components: {
                CheckMatrix: true,
                simpletime: true,
                simpletextfield: true,
            },
        },
        layout: {
            components: {
                //true here means hide, change below to false to show table component under layout section
                table: true,
            },
        },
    },
    editForm: {
        textfield: [
            //Way 1 to customize display tab
            {
                key: 'display',
                components: defaultEditFormComponentsIgnored,
                //change to false to display
                ignore: true,
            },
            //Adding custom tab in the edit form
            //Way 2 to customize display tab (create our own)
            {
                //Tab that has more weight will appear on the right
                weight: 0,
                type: 'textfield',
                label: 'Display',
                key: 'newField',
                //Adding our own list of components for the textfield edit form
                components: [
                    {
                        //less weight means appears above other fields
                        weight: 0,
                        type: 'textfield',
                        input: true,
                        key: 'label',
                        label: 'Label',
                        placeholder: 'Field Label',
                        tooltip: 'The label for this field that will appear next to it.',
                        validate: {
                            required: true,
                        },
                    },
                ],
            },
            {
                key: 'data',
                //change to false to display
                ignore: true,
            },
        ],
        //We can do same as above for the textarea component
        textarea: [],
    },
};
