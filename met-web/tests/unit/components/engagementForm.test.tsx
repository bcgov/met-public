import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import 'jest-dom/extend-expect';
import EngagementForm from 'components/engagement/form/EngagementForm';

afterEach(cleanup);

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<EngagementForm />, div);
});
