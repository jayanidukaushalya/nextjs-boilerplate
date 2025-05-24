'use client';

import AppHeader from '@/components/common/header';
import { AppSidebar } from '@/components/common/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
