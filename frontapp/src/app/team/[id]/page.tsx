"use client";

import api from "@/app/utils/api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Cog6ToothIcon, DocumentPlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import {
  DocumentTextIcon,
  UserMinusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import TeamDropDown from "@/app/utils/teamDropDown";

export default function createTeam() {
  const [team, setTeam] = useState(null);
  const [articles, setArticles] = useState([]);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const handlerModal = () => {
    setOpen(true);
  };

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
      setArticles(res.data.data.articles);
    });
  };

  const createArticle = async () => {
    const title = document.getElementsByName("title")[0]?.value;

    console.log(title);

    if (title == "") {
      alert("게시글 제목을 입력해 주세요.");
      return;
    }

    await api
      .post("/api/v1/articles/create", {
        title: title,
        teamId: team && team?.id,
        isTeam: true,
      })
      .then((res) => {
        console.log(res);

        alert(res.data.msg);

        if (res.data.isFail) {
          return;
        }

        router.push("/article/" + res.data.data.article.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteFunction = function () {
    if (!confirm("삭제된 팀은 되돌릴 수 없습니다.\n삭제하시겠습니까?")) {
      return;
    }
    api
      .delete("/api/v1/team/" + id)
      .then((res) => {
        console.log(res);

        alert(res.data.msg);

        if (res.data.isFail) {
          return;
        }

        router.push("/team");
      })
      .catch(function (error) {
        console.log(error);
        // router.push("/team");
      });
  };

  const handlerLeave = async () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) {
      return;
    }

    await api.delete(`/api/v1/teamMember/` + id).then((res) => {
      alert(res.data.msg);

      if (res.data.isSuccess) {
        router.push("/team");
        return;
      }
    });
  };

  useEffect(() => {
    getMember();
    getTeamById();
  }, []);

  return (
    <div className="mt-16 px-36  h-100 justify-center align-center my-auto ">
      <div className="flex gap-3 h-96">
        <div className="card bg-base-100 w-2/3 shadow-xl">
          <div className=" text-center border-b-2 py-3 text-2xl font-bold">
            {team && team.teamName}
            {(member && member.id) === (team && team.teamAdmin.id) ? (
              <div className="float-end inline-block me-3">
                <TeamDropDown teamId={Number(id)} onClick={deleteFunction} />
              </div>
            ) : (
              <button
                onClick={handlerLeave}
                className="float-end inline-block me-3"
              >
                <UserMinusIcon className="stroke-red-500 w-7 me-3" />
              </button>
            )}
          </div>
          <div className="card-body">
            <div className=" grid grid-cols-3 gap-2">
              <div className="bg-slate-200 border">
                <figure>
                  <img
                    src={team && team.teamImg.path}
                    className="object-contain bg-slate-200 h-60"
                    alt={team && team.teamImg.originalFileName}
                  />
                </figure>
              </div>
              <div className="ms-5 col-span-2 flex flex-col justify-between">
                <div>{team && team.teamDescription}</div>
                <div className="flex justify-end">
                  <img
                    className="h-7 w-7 object-cover rounded-full border me-2"
                    id="preview"
                    src={team?.teamAdmin.memberImgPath}
                    alt="MemberProfile"
                  />
                  {team && team.teamAdmin.username}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 w-1/3 shadow-xl">
          <div className="text-center border-b-2 py-3 text-2xl font-bold">
            Members
            {(member && member.id) === (team && team.teamAdmin.id) ? (
              <a
                className="btn btn-sm float-end align-center me-2 text-base font-normal"
                href={"/team/" + team && team.id + "/teamMember"}
              >
                <Cog6ToothIcon className="w-3" />
              </a>
            ) : (
              ""
            )}
          </div>
          <div className="card-body overflow-auto">
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
      </div>

      <div className="card bg-base-100 w-full shadow-xl mt-4">
        <div className="text-center border-b-2 py-3 text-2xl font-bold">
          Article
          <button
            className="btn btn-sm float-end align-center me-2 text-base font-normal"
            onClick={handlerModal}
          >
            +
          </button>
        </div>

        <div className="card-body grid md:grid-cols-6 lg:grid-cols-9 gap-6">
          {articles &&
            articles.map((article) => (
              <Link key={article.id} href={"/article/" + article.id}>
                <DocumentTextIcon className="stroke-1" />

                <div className="text-center truncate">{article.title}</div>
              </Link>
            ))}
        </div>
      </div>
      <Transition.Root show={open}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        <DocumentPlusIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Create Aritcle
                        </Dialog.Title>
                        <div className="mt-2">
                          <label
                            htmlFor="Title"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Title
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              required
                              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-300 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        createArticle();
                      }}
                    >
                      create
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
