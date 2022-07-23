/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.htmlelement;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'paragraph';
const DISPLAY = 'Paragraph';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                type: ID,
                label: DISPLAY,
                key: ID,
                tag: 'p',
            },
            ...extend,
        );
    }

    public static editForm = editForm;

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'heading',
            weight: 22,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
