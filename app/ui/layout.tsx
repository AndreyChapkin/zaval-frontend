import React from 'react';
import SideMenu from '../_components/general/side-menu/SideMenu';
import './layout.scss';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className='workspace'>
            <SideMenu />
            {children}
        </div>
    );
};

export default Layout;