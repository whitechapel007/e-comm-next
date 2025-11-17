import { NavMenu } from ".";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";

const MoblieNav = ({ data }: { data: NavMenu }) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Image
          priority
          src="/icons/menu.svg"
          height={100}
          width={100}
          alt="menu"
          className="max-w-[22px] max-h-[22px]"
        />
      </SheetTrigger>

      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader className="">
          <Link href="/" className="text-2xl">
            VFH
          </Link>
        </SheetHeader>
        <div className="flex flex-col items-start p-4">
          {data.map((item) => (
            <div key={item.id} className="w-full">
              {item.type === "MenuItem" && (
                <SheetClose asChild>
                  <Link href={item.url ?? "/"} className="mb-4">
                    {item.label}
                  </Link>
                </SheetClose>
              )}

              {item.type === "MenuList" && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={item.label} className="border-none">
                    <AccordionTrigger className="text-left p-0 py-0.5 font-normal text-base">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="px-2 text-balance border-l flex flex-col">
                      {item.children.map((itemChild) => (
                        <SheetClose
                          key={itemChild.id}
                          asChild
                          className="w-fit py-2 text-base"
                        >
                          <Link href={itemChild.url ?? "/"}>
                            {itemChild.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MoblieNav;
