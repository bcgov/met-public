import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import 'jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import SideNav from 'components/layout/SideNav/SideNav';

afterEach(cleanup);

const drawerWidth = 240;

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SideNav isMediumScreen={false} open={true} drawerWidth={drawerWidth} />, div);
});
