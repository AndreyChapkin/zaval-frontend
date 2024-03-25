import React from 'react';
import SideMenu from '../_components/general/side-menu/SideMenu';
import './layout.scss';
import "../composition.scss";
import "../sizing.scss";
import "../spacing.scss";

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