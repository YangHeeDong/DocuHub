'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useRq from "@/app/utils/rq";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const rq = useRq();

  useEffect( () => {
    rq.initAuth();
  },[])

  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="navbar bg-base-100 absolute">
        <div className="navbar-start">
          
          <a className="btn btn-ghost text-2xl font-bold">DocuHub</a>
        </div>
        <div className="navbar-center lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="/team">Team</a></li>
            <li><a href="/article">Article</a></li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
                
              </details>
            </li>
          </ul>
        </div>
        <div className="navbar-end me-2">
          
          {
            rq.isLogin() === false ?
            <div>
              <Link href="/member/signup" className="btn btn-sm btn-ghost ">Sign Up</Link>
              <Link href="/member/login" className="btn btn-sm btn-ghost ">Sign In</Link>
            </div>
             :
            <button onClick={rq.setLogout} className="btn btn-sm btn-ghost ">Logout</button>
          }
        </div>
      </div>
      <div className="h-screen">
        <div className="pt-20">
            {children}
        </div>
        
      </div>
        
      </body>
    </html>
  );
}
