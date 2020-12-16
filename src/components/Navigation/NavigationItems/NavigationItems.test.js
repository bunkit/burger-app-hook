import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() })

describe('<NavigationItems />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NavigationItems />)
    })
    it('should render two <Navigationitem /> component if not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });
    it('should render 3 <Navigationitem /> component if authenticated', () => {
        wrapper.setProps({ isAuthenticated: true })
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });
    it('should render logout <NavigationItem> if authenticated', () => {
        wrapper.setProps({ isAuthenticated: true })
        expect(wrapper.contains(<NavigationItem exact link="/logout">Logout</NavigationItem>)).toEqual(true);
    });

});

