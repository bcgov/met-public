const EXAMPLE_COMPONENTS = [
    {
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
    {
        type: 'select',
        input: true,
        key: 'labelPosition',
        label: 'Label Position',
        tooltip: 'Position for the label for this field.',
        weight: 20,
        defaultValue: 'top',
        dataSrc: 'values',
        data: {
            values: [
                {
                    label: 'Top',
                    value: 'top',
                },
                {
                    label: 'Left (Left-aligned)',
                    value: 'left-left',
                },
                {
                    label: 'Left (Right-aligned)',
                    value: 'left-right',
                },
                {
                    label: 'Right (Left-aligned)',
                    value: 'right-left',
                },
                {
                    label: 'Right (Right-aligned)',
                    value: 'right-right',
                },
                {
                    label: 'Bottom',
                    value: 'bottom',
                },
            ],
        },
    },
    {
        type: 'number',
        input: true,
        key: 'labelWidth',
        label: 'Label Width',
        tooltip: 'The width of label on line in percentages.',
        clearOnHide: false,
        weight: 30,
        placeholder: '30',
        suffix: '%',
        validate: {
            min: 0,
            max: 100,
        },
        conditional: {
            json: {
                and: [
                    {
                        '!==': [
                            {
                                var: 'data.labelPosition',
                            },
                            'top',
                        ],
                    },
                    {
                        '!==': [
                            {
                                var: 'data.labelPosition',
                            },
                            'bottom',
                        ],
                    },
                ],
            },
        },
    },
    {
        type: 'number',
        input: true,
        key: 'labelMargin',
        label: 'Label Margin',
        tooltip: 'The width of label margin on line in percentages.',
        clearOnHide: false,
        weight: 30,
        placeholder: '3',
        suffix: '%',
        validate: {
            min: 0,
            max: 100,
        },
        conditional: {
            json: {
                and: [
                    {
                        '!==': [
                            {
                                var: 'data.labelPosition',
                            },
                            'top',
                        ],
                    },
                    {
                        '!==': [
                            {
                                var: 'data.labelPosition',
                            },
                            'bottom',
                        ],
                    },
                ],
            },
        },
    },
    {
        weight: 100,
        type: 'textfield',
        input: true,
        key: 'placeholder',
        label: 'Placeholder',
        placeholder: 'Placeholder',
        tooltip: 'The placeholder text that will appear when this field is empty.',
    },
    {
        weight: 200,
        type: 'textarea',
        input: true,
        key: 'description',
        label: 'Description',
        placeholder: 'Description for this field.',
        tooltip: 'The description is text that will appear below the input field.',
        editor: 'ace',
        as: 'html',
        wysiwyg: {
            minLines: 3,
            isUseWorkerDisabled: true,
        },
    },
    {
        weight: 300,
        type: 'textarea',
        input: true,
        key: 'tooltip',
        label: 'Tooltip',
        placeholder: 'To add a tooltip to this field, enter text here.',
        tooltip: 'Adds a tooltip to the side of this field.',
        editor: 'ace',
        as: 'html',
        wysiwyg: {
            minLines: 3,
            isUseWorkerDisabled: true,
        },
    },
    {
        weight: 500,
        type: 'textfield',
        input: true,
        key: 'customClass',
        label: 'Custom CSS Class',
        placeholder: 'Custom CSS Class',
        tooltip: 'Custom CSS class to add to this component.',
    },
    {
        weight: 600,
        type: 'textfield',
        input: true,
        key: 'tabindex',
        label: 'Tab Index',
        placeholder: '0',
        tooltip:
            "Sets the tabindex attribute of this component to override the tab order of the form. See the <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex'>MDN documentation</a> on tabindex for more information.",
    },
    {
        weight: 1100,
        type: 'checkbox',
        label: 'Hidden',
        tooltip: 'A hidden field is still a part of the form, but is hidden from view.',
        key: 'hidden',
        input: true,
    },
    {
        weight: 1200,
        type: 'checkbox',
        label: 'Hide Label',
        tooltip:
            'Hide the label (title, if no label) of this component. This allows you to show the label in the form builder, but not when it is rendered.',
        key: 'hideLabel',
        input: true,
    },
    {
        weight: 1350,
        type: 'checkbox',
        label: 'Initial Focus',
        tooltip: 'Make this field the initially focused element on this form.',
        key: 'autofocus',
        input: true,
    },
    {
        weight: 1370,
        type: 'checkbox',
        label: 'Show Label in DataGrid',
        tooltip: 'Show the label when in a Datagrid.',
        key: 'dataGridLabel',
        input: true,
        customConditional: function customConditional(context: any) {
            var _context$instance$opt, _context$instance$opt2;

            return (_context$instance$opt = context.instance.options) === null || _context$instance$opt === void 0
                ? void 0
                : (_context$instance$opt2 = _context$instance$opt.flags) === null || _context$instance$opt2 === void 0
                ? void 0
                : _context$instance$opt2.inDataGrid;
        },
    },
    {
        weight: 1400,
        type: 'checkbox',
        label: 'Disabled',
        tooltip: 'Disable the form input.',
        key: 'disabled',
        input: true,
    },
    {
        weight: 1500,
        type: 'checkbox',
        label: 'Table View',
        tooltip: 'Shows this value within the table view of the submissions.',
        key: 'tableView',
        input: true,
    },
    {
        weight: 1600,
        type: 'checkbox',
        label: 'Modal Edit',
        tooltip: 'Opens up a modal to edit the value of this component.',
        key: 'modalEdit',
        input: true,
    },
];

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
        advanced: false,
        data: false,
        premium: false,
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
