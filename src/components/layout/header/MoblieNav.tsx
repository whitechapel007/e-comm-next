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
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MoblieNav = ({ data }: { data: NavMenu }) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Menu className="h-6 w-6 text-slate-700" />
      </SheetTrigger>

      <SheetContent side="left" className="overflow-y-auto px-4 py-4">
        <SheetHeader className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            Eboya Boi
          </Link>
          <SheetClose asChild>
            <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {data.map((item) => (
            <div key={item.id} className="space-y-2">
              {item.type === "MenuItem" && (
                <SheetClose asChild>
                  <Link
                    href={item.url ?? "/"}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-900 transition hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              )}
              {item.type === "MenuList" && (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <AccordionItem value={item.label} className="border-none">
                    <AccordionTrigger className="w-full px-4 py-3 text-left text-base font-medium text-slate-900">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 px-4 pb-4 pt-2">
                      {item.children?.map((itemChild) => (
                        <SheetClose key={itemChild.id} asChild>
                          <Link
                            href={itemChild.url ?? "/"}
                            className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                          >
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
