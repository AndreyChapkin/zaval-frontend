import React from 'react';
import SideMenu from '../_components/general/side-menu/SideMenu';
import './layout.scss';
import "../composition.scss";
import "../sizing.scss";
import "../spacing.scss";
import FRow from '../_components/general/flex-line/FRow';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <FRow alignItems='stretch' justifyContent='start' spacing={0} className='workspace'>
            <SideMenu />
            {children}
        </FRow>
    );
};

export default Layout;