"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "./api";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NavbarDropDown from "./navbarDropDown";

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

  const handlerTeamCreate = () => {
    alert("로그인 후 이용해 주세요");
    router.push("/member/login");
    return;
  };

  return (
    <div className="navbar bg-base-100 relative z-50">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-2xl font-bold">
          DocuHub
        </a>
      </div>
      <div className="navbar-center lg:flex">
        {data === null ? (
          <ul className="menu menu-horizontal px-1">
            <li>
              <button onClick={handlerTeamCreate}>Create Team</button>
            </li>
          </ul>
        ) : (
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/team/create">Create Team</a>
            </li>
            <li>
              <a href="/team">My Teams</a>
            </li>
          </ul>
        )}
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
          <NavbarDropDown data={data} onClick={() => mutation.mutate()} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
