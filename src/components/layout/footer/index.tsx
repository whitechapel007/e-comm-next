"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">VFH Store</h2>
          <p>
            Find a location nearest you.
            <br />
            See our stores.
          </p>
          <p className="mt-4 font-semibold">+2349050403040</p>
          <p className="text-gray-400">eboyaboifashionhub@gmail.com</p>
        </div>

        {/* Shop Links */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Shop</h2>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
            <li><Link href="/profile" className="hover:text-white transition-colors">My account</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Services</h2>
          <ul className="space-y-2 text-gray-300">
            <li><span className="hover:text-white cursor-pointer transition-colors">About us</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Careers</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Delivery info</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Privacy policy</span></li>
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Get Our News And Updates
          </h2>
          <form className="flex space-x-2 mb-2">
            <Input
              placeholder="Enter your email"
              className="bg-gray-900 text-white border-none"
            />
            <Button
              type="submit"
              className="bg-white text-black font-bold px-6"
            >
              Subscribe
            </Button>
          </form>
          <p className="text-gray-400 text-sm mb-4">
            By subscribing you agree to our{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
          <div className="flex space-x-6 text-2xl items-center">
            <Facebook size={28} />
            <Instagram size={28} />
            <Twitter size={28} />
          </div>
        </div>
      </div>

      {/* Payment and Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col md:flex-row items-center justify-between">
        <div className="flex space-x-3 mb-4 md:mb-0">
          <CreditCard size={36} />
        </div>
        <div className="text-center md:text-right text-2xl italic font-serif mb-2 md:mb-0">
          VFH
        </div>
        <div className="text-gray-400 text-sm">©2024 by Ebuka</div>
      </div>
    </footer>
  );
}
