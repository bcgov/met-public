// components/Form/formio/setup.ts
import { Formio } from '@formio/react';
import MetFormioComponents from 'met-formio';
import 'components/Form/formio.scss';

let initialized = false;

export default function setupFormio() {
    if (initialized) return;
    Formio.use(MetFormioComponents);
    Formio.Utils.Evaluator.noeval = false;
    initialized = true;
}
