"use client";

import Link from "next/link";
import MoblieNav from "./MoblieNav";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import CartIcon from "./CartIcon";
import UserAvatar from "./Avatar";

export type MenuItem = {
  id: number;
  type: "MenuItem" | "MenuList";
  label: string;
  url?: string;
  admin?: boolean;
  children?: (Omit<MenuItem, "children" | "type"> & {
    description?: string | React.ReactNode;
  })[];
};

export type NavMenu = MenuItem[];

const data: NavMenu = [
  {
    id: 0,
    label: "Home",
    type: "MenuItem",
    url: "/",
  },
  {
    id: 1,
    label: "Shop",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Kaftans",
        url: "/shop?category=kaftan",
        description: "Flowing, luxurious Kaftans tailored to perfection in Akoka",
      },
      {
        id: 12,
        label: "Agbada",
        url: "/shop?category=agbada",
        description: "Regal Agbada sets — the pinnacle of Nigerian formal style",
      },
      {
        id: 13,
        label: "Shirts",
        url: "/shop?category=shirts",
        description: "Crisp, bespoke shirts for every occasion",
      },
      {
        id: 14,
        label: "2-Piece",
        url: "/shop?category=two_piece",
        description: "Matching sets styled and tailored just for you",
      },
      {
        id: 15,
        label: "Casualwear",
        url: "/shop?category=casualwear",
        description: "Everyday fits with style in every thread",
      },
    ],
  },
  {
    id: 2,
    label: "Orders",
    type: "MenuItem",
    url: "/admin/orders",
    admin: true,
  },
  {
    id: 3,
    label: "Users",
    type: "MenuItem",
    url: "/admin/users",
    admin: true,
  },
  {
    id: 4,
    label: "Products",
    type: "MenuItem",
    url: "/admin/products",
    admin: true,
  },
];

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(globalThis.scrollY > 10);
    globalThis.addEventListener("scroll", handleScroll, { passive: true });
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredData = useMemo(
    () => data.filter((item) => !(item.admin && !isAdmin)),
    [isAdmin]
  );

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "border-b bg-white/95 shadow-sm backdrop-blur" : "bg-white/90"}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Eboya Boi" width={48} height={48} />
            <div>
              <p className="text-lg font-semibold tracking-tight">Eboya Boi</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Akoka, Lagos</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <MoblieNav data={filteredData} />
            <CartIcon />
            <UserAvatar />
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                type="search"
                aria-label="Search products"
                placeholder="Search the store..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <CartIcon />
            <UserAvatar />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
          <NavigationMenu className="flex-1">
            <NavigationMenuList>
              {filteredData.map((item) => (
                <div key={item.id}>
                  {item.type === "MenuItem" && (
                    <NavigationMenuItem asChild>
                      <Link href={item.url ?? "/"} className="px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-900">
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  )}

                  {item.type === "MenuList" && (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium text-slate-700">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-105 gap-3 p-4 md:w-130 md:grid-cols-2 lg:w-155">
                          {item.children?.map((child) => (
                            <NavigationMenuLink asChild key={child.id}>
                              <Link
                                href={child.url ?? "/"}
                                className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                              >
                                <p className="text-base font-semibold">{child.label}</p>
                                <p className="mt-2 text-xs text-slate-500">{child.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}
                </div>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
