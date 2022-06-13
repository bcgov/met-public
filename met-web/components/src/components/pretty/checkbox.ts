import { Components } from 'formiojs';
import prettify from './prettify';
const CheckBoxComponent: any = Components.components.checkbox;
export default class PrettyCheckbox extends CheckBoxComponent {
    constructor(component, options, data) {
        super(component, options, data);
    }
}
prettify(PrettyCheckbox);