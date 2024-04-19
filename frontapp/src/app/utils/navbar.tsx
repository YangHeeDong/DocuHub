"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "./api";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const initAuth = async () => {
    return await api
      .get("/api/v1/members/me")
      .then((response) => response.data.data);
  };

  const handlerLogout = async () => {
    return await api.post("/api/v1/members/logout");
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["loginedMember"],
    queryFn: initAuth,
  });

  if (error) {
    queryClient.setQueryData(["loginedMember"], null);
  }

  if (isLoading) <>Loading...</>;

  const mutation = useMutation({
    mutationFn: handlerLogout,
    onSuccess: () => {
      queryClient.setQueryData(["loginedMember"], null);
      router.push("/");
    },
  });

  return (
    <div className="navbar bg-base-100 absolute">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-2xl font-bold">
          DocuHub
        </a>
      </div>
      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/team">Team</a>
          </li>
          <li>
            <a href="/article">Article</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end me-2">
        {data === null ? (
          <div>
            <Link href="/member/signup" className="btn btn-sm btn-ghost ">
              Sign Up
            </Link>
            <Link href="/member/login" className="btn btn-sm btn-ghost ">
              Sign In
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                className="h-10 w-10 object-cover rounded-full border me-2"
                id="preview"
                src={data && data?.memberImgPath}
                alt="MemberProfile"
              />
              {data && data.username}
            </div>
            <button
              onClick={() => mutation.mutate()}
              className="btn btn-sm btn-ghost "
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
