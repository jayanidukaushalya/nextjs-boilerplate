'use client';

import { Fragment } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const AppHeader = () => {
  const pathname = usePathname();

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    // Remove leading slash and split by '/'
    const pathSegments = pathname.split('/').filter((segment) => segment);

    // Create breadcrumb items
    return pathSegments.map((segment, index) => {
      // Create the path for this breadcrumb
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

      // Format the segment for display (capitalize first letter, replace hyphens with spaces)
      const formattedSegment = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        path,
        label: formattedSegment,
        isLast: index === pathSegments.length - 1,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home/Dashboard is always the first item */}
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Add dynamic breadcrumb items */}
            {breadcrumbs.length > 1 &&
              breadcrumbs.slice(1).map((breadcrumb) => (
                <Fragment key={breadcrumb.path}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.path}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default AppHeader;
