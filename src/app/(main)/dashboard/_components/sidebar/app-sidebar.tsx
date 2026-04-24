"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { CircleHelp, Command, Search, Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { supabase } from "@/lib/supabase/supabaseClient";
import { candidateSidebarItems, companySidebarItems, sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState<"company" | "candidate" | "admin" | "super_admin" | null>(null);
  const [navUser, setNavUser] = useState({ name: "", email: "", avatar: "" });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const userId = data.user.id;

      const { data: company } = await supabase
        .from("companies")
        .select("id, name, email, logo_url")
        .eq("id", userId)
        .maybeSingle();

      if (company) {
        setRole("company");
        setNavUser({
          name: company.name ?? "",
          email: company.email ?? data.user.email ?? "",
          avatar: company.logo_url ?? "",
        });
        return;
      }

      const { data: admin } = await supabase.from("admins").select("role").eq("id", userId).maybeSingle();

      if (!admin) {
        // Candidat
        setRole("candidate");
        const { data: profile } = await supabase
          .from("profiles")
          .select("firstname, lastname, avatar_url")
          .eq("id", userId)
          .maybeSingle();
        setNavUser({
          name: `${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`.trim() || (data.user.email ?? ""),
          email: data.user.email ?? "",
          avatar: profile?.avatar_url ?? "",
        });
        return;
      }

      setRole(admin.role === "super_admin" ? "super_admin" : "admin");
      setNavUser({
        name: data.user.user_metadata?.full_name ?? data.user.email ?? "",
        email: data.user.email ?? "",
        avatar: data.user.user_metadata?.avatar_url ?? "",
      });
    });
  }, []);

  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/dashboard/default">
                <Command />
                <span className="font-semibold text-base">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {role !== null && (
          <NavMain
            items={
              role === "company"
                ? companySidebarItems
                : role === "candidate"
                  ? candidateSidebarItems
                  : role === "super_admin"
                    ? sidebarItems
                    : []
            }
          />
        )}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
