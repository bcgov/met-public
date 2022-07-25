import baseEditForm from 'formiojs/components/_classes/component/Component.form';
import EditDisplay from './editForm/Component.edit.display';
import EditValidation from './editForm/Component.edit.validation';
import SimpleConditional from '../Common/Simple.edit.conditional';

export default function (...extend) {
    return baseEditForm(
        [
            EditDisplay,
            {
                key: 'data',
                ignore: true,
            },
            {
                key: 'api',
                ignore: true,
            },
            {
                key: 'layout',
                ignore: true,
            },
            {
                key: 'conditional',
                ignore: true,
            },
            {
                key: 'validation',
                ignore: true,
            },
            {
                key: 'logic',
                ignore: true,
            },
            {
                key: 'addons',
                ignore: true,
            },
            {
                label: 'Validation',
                key: 'customValidation',
                weight: 20,
                components: EditValidation,
            },
            {
                label: 'Conditions',
                key: 'customConditional',
                weight: 40,
                components: SimpleConditional,
            },
        ],
        ...extend,
    );
}
