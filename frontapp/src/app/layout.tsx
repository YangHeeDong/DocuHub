'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const router = useRouter();

  const handleLogout = async () => {

    const response = await fetch("http://localhost:8010/api/v1/members/logout", {
        method: 'POST',
        credentials: 'include', // 핵심 변경점
        headers: {
            'Content-Type': 'application/json' 
        }
    }).then(res => res.json());

    alert(response.msg);

    router.push("/");

  }

  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="navbar bg-base-100 absolute">
        <div className="navbar-start">
          
          <a className="btn btn-ghost text-2xl font-bold">DocuHub</a>
        </div>
        <div className="navbar-center hidden lg:flex">
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
          <Link href="/member/signup" className="btn btn-sm btn-ghost ">Sign Up</Link>
          <Link href="/member/login" className="btn btn-sm btn-ghost ">Sign In</Link>
          <button onClick={handleLogout} className="btn btn-sm btn-ghost ">Logout</button>
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
