/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.htmlelement;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'header';
const DISPLAY = 'Header';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                type: ID,
                label: DISPLAY,
                key: ID,
                tag: 'h1',
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
