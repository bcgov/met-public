export default {
    key: 'display',
    components: [
        {
            key: 'tableView',
            ignore: true,
        },
        {
            key: 'hidden',
            ignore: true,
        },
        {
            key: 'modalEdit',
            ignore: true,
        },
        {
            key: 'refreshOnChange',
            ignore: true,
        },
        {
            key: 'className',
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
            key: 'inputMask',
            ignore: true,
        },
        {
            key: 'allowMultipleMasks',
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
            key: 'labelPosition',
            ignore: true,
        },
        {
            key: 'label',
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
            key: 'tabindex',
            ignore: true,
        },
        {
            key: 'autofocus',
            ignore: true,
        },
        {
            key: 'disabled',
            ignore: true,
        },
        {
            key: 'hideLabel',
            ignore: true,
        },
        {
            key: 'placeholder',
            ignore: true,
        },
        {
            type: 'textarea',
            input: true,
            editor: 'ace',
            rows: 10,
            as: 'html',
            label: 'Content',
            tooltip: 'The content of this HTML element.',
            defaultValue: '<div class="well">Content</div>',
            key: 'content',
            weight: 0,
        },
        {
            type: 'textfield',
            input: true,
            key: 'className',
            weight: 60,
            label: 'CSS Class',
            placeholder: 'CSS Class',
            tooltip: 'The CSS class for this HTML element.',
            defaultValue: 'title',
        },
    ],
};
