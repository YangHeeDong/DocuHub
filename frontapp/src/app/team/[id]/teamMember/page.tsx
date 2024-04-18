"use client";

import api from "@/app/utils/api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function createTeam() {
  const [team, setTeam] = useState(null);
  const router = useRouter();

  const id = useParams().id;

  const [member, setMember] = useState({});
  const getMember = async () =>
    await api
      .get("/api/v1/members/me")
      .then((res) => {
        console.log(res);
        if (res.data.isFail) {
          router.push("/");
        }
        setMember({
          ...member,
          id: res.data.data.id,
          username: res.data.data.username,
        });
      })
      .catch(function (error) {
        router.push("/");
      });

  const getTeamById = async () => {
    const data = await api.get(`/api/v1/team/getTeam/` + id).then((res) => {
      console.log(res.data);

      if (res.data.isFail) {
        alert(res.data.msg);
        router.push("/");
        return;
      }

      setTeam(res.data.data.team);
    });
  };

  useEffect(() => {
    getMember();
    getTeamById();
  }, []);

  return (
    <div className="px-36  h-100 justify-center align-center my-auto ">
      <div className="flex gap-3">
        <div className="card bg-base-100 w-1/2 shadow-xl">
          <div className=" flex items-center justify-center text-center border-b-2 py-3 text-2xl font-bold">
            <img
              className="h-10 w-10 object-cover rounded-full border me-2"
              id="preview"
              src={team?.teamImg.path}
              alt="MemberProfile"
            />
            {team && team.teamName} Members
          </div>
          <div className="card-body overflow-auto h-0">
            {team &&
              team.teamMemberList.map((member) => (
                <div
                  className="flex items-center justify-between"
                  key={member.id}
                >
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 object-cover rounded-full border me-2"
                      id="preview"
                      src={member?.memberImgPath}
                      alt="MemberProfile"
                    />
                    {member.username}
                  </div>
                  <div>
                    {team.teamAdmin.id === member.id ? "Admin" : "Member"}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="w-1/2">
          <div className="card bg-base-100 h-100 shadow-xl mb-3">
            <div className=" flex items-center justify-between px-7 text-center border-b-2 py-3 text-2xl font-bold">
              Search Member
              <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            <div className="card-body overflow-auto h-60"></div>
          </div>

          <div className="card bg-base-100 h-100 shadow-xl">
            <div className=" flex items-center justify-center text-center border-b-2 py-3 text-2xl font-bold">
              초대 중 인 회원
            </div>
            <div className="card-body overflow-auto h-60">123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
