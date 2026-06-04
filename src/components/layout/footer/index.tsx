"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="mb-1 text-xl font-bold tracking-tight">Eboya Boi</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Fashion Hub</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Kaftans, Agbadas, shirts, 2-pieces &amp; casualwears — tailored
            beyond ordinary. Style in every thread, made just for you.
          </p>
          <p className="mt-4 text-sm">
            📍 Akoka, Lagos Nigeria
          </p>
          <p className="mt-1 font-semibold text-sm">+2349050403040</p>
          <p className="text-gray-400 text-sm">eboyaboifashionhub@gmail.com</p>
        </div>

        {/* Shop Links */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Shop</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/shop?category=kaftan"     className="hover:text-white transition-colors">Kaftans</Link></li>
            <li><Link href="/shop?category=agbada"     className="hover:text-white transition-colors">Agbada</Link></li>
            <li><Link href="/shop?category=shirts"     className="hover:text-white transition-colors">Shirts</Link></li>
            <li><Link href="/shop?category=two_piece"  className="hover:text-white transition-colors">2-Piece</Link></li>
            <li><Link href="/shop?category=casualwear" className="hover:text-white transition-colors">Casualwear</Link></li>
            <li><Link href="/shop"                     className="hover:text-white transition-colors">All Collections</Link></li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Account</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/profile" className="hover:text-white transition-colors">My account</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Delivery info</span></li>
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Stay in the loop</h2>
          <p className="text-gray-400 text-sm mb-3">
            Get new arrivals, styling tips &amp; exclusive offers straight to your inbox.
          </p>
          <form className="flex space-x-2 mb-2">
            <Input
              placeholder="Your email address"
              className="bg-gray-900 text-white border-gray-700 focus:border-white text-sm"
            />
            <Button type="submit" className="bg-white text-black font-bold px-4 hover:bg-gray-100 text-sm">
              Join
            </Button>
          </form>
          <p className="text-gray-500 text-xs mb-4">
            By subscribing you agree to our{" "}
            <span className="underline cursor-pointer text-gray-400 hover:text-white transition-colors">Privacy Policy</span>
          </p>
          <div className="flex space-x-5 items-center">
            <Facebook size={22} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
            <Instagram size={22} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
            <Twitter size={22} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <CreditCard size={22} />
          <span className="text-xs">Secure payments via Paystack</span>
        </div>
        <p className="text-xl italic font-serif font-bold tracking-tight">Eboya Boi</p>
        <p className="text-gray-500 text-xs">©{new Date().getFullYear()} Eboya Boi Fashion Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}
