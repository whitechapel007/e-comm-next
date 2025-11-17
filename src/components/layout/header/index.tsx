"use client";
import Link from "next/link";
import MoblieNav from "./MoblieNav";

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
  children:
    | (Omit<MenuItem, "children" | "type"> & {
        description?: string | React.ReactNode;
      })[]
    | [];
};

export type MenuListData = (Omit<MenuItem, "children" | "type"> & {
  description?: string | React.ReactNode;
})[];

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
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-7xl mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <Link href="/" className="text-2xl lg:text-4xl  mr-3 lg:mr-10">
          VFH
        </Link>
        <div className="block md:hidden mr-4">
          <MoblieNav data={data} />
        </div>

        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <div key={item.id}>
                {item.type === "MenuItem" && (
                  <NavigationMenuItem asChild>
                    <Link href={item.url ?? "/"}>
                      <p
                        className="
                        font-normal px-3"
                      >
                        {item.label}
                      </p>
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
                        {item.children.map((item) => (
                          <NavigationMenuLink
                            asChild
                            key={item.id}
                            title={item.label}
                          >
                            <Link
                              className="
            block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground
         "
                              href={item.url ?? "/"}
                            >
                              <div className="mt-4 mb-2 text-lg font-medium">
                                {item.label}
                              </div>
                              <p className="text-muted-foreground text-sm leading-tight">
                                {item.description}
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
        <div className="flex items-center  ml-auto gap-2">
          <CartIcon />
          <UserAvatar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
