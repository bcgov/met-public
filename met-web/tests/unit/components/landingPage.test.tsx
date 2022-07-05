import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import 'jest-dom/extend-expect';
import LandingPage from 'components/LandingPage/LandingPage';

afterEach(cleanup);

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LandingPage />, div);
});
