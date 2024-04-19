"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/app/utils/api";

export default function team() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["loginedMember"],
  });

  if (isLoading) return;

  if (data == null) {
    router.push("/");
  }

  return (
    <div className="px-36 flex justify-center align-center my-auto">
      <div className="card size-full bg-base-100 shadow-xl mb-5 mt-3">
        <div className=" text-center  text-2xl font-bold border-b-2 py-3">
          My Teams
        </div>

        <div className="card-body"></div>
      </div>
    </div>
  );
}
