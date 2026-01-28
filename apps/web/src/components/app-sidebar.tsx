'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { moduleSections } from '@/config/modules';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">M</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">MAG System</h2>
            <p className="text-xs text-muted-foreground">Gestão de Locação</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {moduleSections.map((section) => (
          <SidebarGroup key={section.section}>
            <SidebarGroupLabel>{section.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((module) => {
                  const isActive = pathname.startsWith(module.href);
                  const Icon = module.icon;

                  return (
                    <SidebarMenuItem key={module.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={module.description}>
                        <Link href={module.href}>
                          <Icon className="h-4 w-4" />
                          <span>{module.title}</span>
                          {module.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {module.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.png" alt="Adair Bento" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium">Adair Bento</p>
            <p className="truncate text-xs text-muted-foreground">Desenvolvedor</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
