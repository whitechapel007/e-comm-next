"use client";

import Link from "next/link";
import MoblieNav from "./MoblieNav";
import { useSession } from "next-auth/react";

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
    id: 1,
    label: "Shop",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Men's clothes",
        url: "/shop?category=men",
        description: "In attractive and spectacular colors and designs",
      },
      {
        id: 12,
        label: "Women's clothes",
        url: "/shop?category=women",
        description: "Ladies, your style and tastes are important to us",
      },
      {
        id: 14,
        label: "Bags",
        url: "/shop?category=bags",
        description: "Suitable for men, women and all tastes and styles",
      },
    ],
  },

  // ADMIN ITEMS
  {
    id: 3,
    label: "Orders",
    type: "MenuItem",
    url: "/admin/orders",
    admin: true,
  },
  {
    id: 4,
    label: "Users",
    type: "MenuItem",
    url: "/admin/users",
    admin: true,
  },
  {
    id: 5,
    label: "Products",
    type: "MenuItem",
    url: "/admin/products",
    admin: true,
  },
];

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  // Filter menu
  const filteredData = data.filter((item) => {
    if (item.admin && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-7xl mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <Link href="/" className="text-2xl lg:text-4xl mr-3 lg:mr-10">
          VFH
        </Link>

        <div className="block md:hidden mr-4">
          <MoblieNav data={filteredData} />
        </div>

        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {filteredData.map((item) => (
              <div key={item.id}>
                {item.type === "MenuItem" && (
                  <NavigationMenuItem asChild>
                    <Link href={item.url ?? "/"}>
                      <p className="font-normal px-3">{item.label}</p>
                    </Link>
                  </NavigationMenuItem>
                )}

                {item.type === "MenuList" && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-normal px-3">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {item.children?.map((child) => (
                          <NavigationMenuLink asChild key={child.id}>
                            <Link
                              href={child.url ?? "/"}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="mt-4 mb-2 text-lg font-medium">
                                {child.label}
                              </div>
                              <p className="text-muted-foreground text-sm leading-tight">
                                {child.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </div>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center ml-auto gap-2">
          <CartIcon />
          <UserAvatar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
