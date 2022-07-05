import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import 'jest-dom/extend-expect';
import SurveyListing from 'components/survey/listing';

afterEach(cleanup);

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SurveyListing />, div);
});
