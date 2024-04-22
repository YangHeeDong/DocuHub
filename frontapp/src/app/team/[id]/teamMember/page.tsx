"use client";

import api from "@/app/utils/api";
import MemberDropDown from "@/app/utils/memberDropDown";
import { TrashIcon } from "@heroicons/react/20/solid";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function createTeam() {
  const [team, setTeam] = useState(null);
  const [searchMembers, setSearchMembers] = useState([]);
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
        getTeamById();
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

  const handlerSearch = async (e) => {
    if (e.target.value == "") {
      setSearchMembers([]);
      return;
    }

    await api
      .get("/api/v1/members/search?searchParam=" + e.target.value)
      .then((res) => {
        if (res.data.isSuccess) {
          setSearchMembers(res.data.data.members);
        }
      });
  };

  const handlerAdmin = async (memberId: string) => {
    if (!confirm("정말 관리자를 변경하시겠습니까?")) {
      return;
    }

    await api
      .patch("/api/v1/teamMember/" + team?.id + "/" + memberId)
      .then((res) => {
        alert(res.data.msg);
        if (res.data.isSuccess) {
          router.push("/team/" + team.id);
        }
      });
  };

  const handlerDelete = async (memberId: string) => {
    if (!confirm("정말 해당회원을 방출 하시겠습니까?")) {
      return;
    }
    await api
      .delete("/api/v1/teamMember/" + team?.id + "/" + memberId)
      .then((res) => {
        alert(res.data.msg);
        if (res.data.isSuccess) {
          getTeamById();
        }
      });
  };

  const isAdmin = () => {
    if (member && team && member.id !== team.teamAdmin.id) {
      router.back();
    }
  };

  const handlerInvite = async (memberId: string) => {
    if (team.teamMemberList.filter((member) => member.id == memberId)[0]) {
      alert("이미 팀 멤버입니다.");
      return;
    }

    if (!confirm("초대 요청을 보내시겠습니까?")) {
      return;
    }

    await api
      .post("/api/v1/teamInvite", { memberId: memberId, teamId: team.id })
      .then((res) => {
        alert(res.data.msg);
        getTeamById();
      });
  };

  useEffect(() => {
    isAdmin();
  }, [team]);

  useEffect(() => {
    getMember();
  }, []);

  return (
    <div className="mt-16 px-36  h-100 justify-center align-center my-auto ">
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
              team.teamMemberList.map((member) =>
                team.teamAdmin.id === member.id ? (
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
                ) : (
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
                    <div className="flex items-center">
                      {team.teamAdmin.id === member.id ? "Admin" : "Member"}
                      <MemberDropDown
                        memberId={member.id}
                        handlerAdmin={handlerAdmin}
                        handlerDelete={handlerDelete}
                      />
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="card bg-base-100 h-100 shadow-xl mb-3">
            <div className=" flex items-center justify-between px-7 text-center border-b-2 py-3 text-2xl font-bold">
              Search Member
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow w-1/3"
                  placeholder="Search"
                  onChange={handlerSearch}
                />
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
            <div className="card-body overflow-auto h-60 gap-4">
              {searchMembers.map((member) => (
                <div
                  className="flex justify-between items-center"
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
                  <button
                    onClick={() => handlerInvite(member.id)}
                    className="btn btn-outline btn-sm"
                  >
                    invite
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 h-100 shadow-xl">
            <div className=" flex items-center justify-center text-center border-b-2 py-3 text-2xl font-bold">
              초대 중 인 회원
            </div>
            <div className="card-body overflow-auto h-60">
              {team &&
                team.teamInviteList.map((member) => (
                  <div
                    className="flex justify-between items-center justify-between"
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
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
