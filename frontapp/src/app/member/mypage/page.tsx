"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentPlusIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import api from "@/app/utils/api";
import { Dialog, Transition } from "@headlessui/react";

export default function team() {
  const router = useRouter();
  const [searchMembers, setSearchMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [receiverMember, setReceiverMember] = useState({});
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState([]);
  const [messageMember, setMessageMember] = useState([]);

  const getMessages = (memberId: string) => {
    api.get("/api/v1/message/" + memberId).then((res) => {
      console.log(res.data);
      setMessages(res.data.data);
    });
  };

  const getMessageMembers = async () => {
    await api
      .get("/api/v1/message")
      .then((res) => setMessageMember(res.data.data));
  };

  useEffect(() => {
    getMessageMembers();
  }, []);

  useEffect(() => {
    messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [getMessages]);

  const { isLoading, data } = useQuery({
    queryKey: ["loginedMember"],
  });

  if (isLoading) return;

  if (data == null) {
    router.push("/");
  }

  const createDate = data && data.createDate.split("T")[0];

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

  const handlerMessage = (memberId: string, username: string) => {
    getMessages(memberId);
    setReceiverMember({ memberId: memberId, username: username });
    setOpen(true);
  };

  const sendMessage = () => {
    const word = document.querySelector(".content");

    if (word.value == "") {
      alert("보낼 메세지를 입력하세요");
      return;
    }

    api
      .post("/api/v1/message", {
        content: word.value,
        memberId: receiverMember.memberId,
        username: receiverMember.username,
      })
      .then((res) => {
        alert(res.data.msg);
        getMessages(receiverMember.memberId);
        getMessageMembers();
      });
    word.value = "";
  };

  const handlerAccept = (id: string) => {
    api.patch("/api/v1/message/teamAccept/" + id).then((res) => {
      alert(res.data.msg);
      getMessages(receiverMember.memberId);
    });
  };
  const handlerReject = (id: string) => {
    api.patch("/api/v1/message/teamReject/" + id).then((res) => {
      alert(res.data.msg);
      getMessages(receiverMember.memberId);
    });
  };

  const messageParsing = (msg: string, msgId: string) => {
    if (msg.split(" ")[0] == "TeamInvite") {
      return (
        <div>
          {msg.split(" ")[1]} 팀에서 초대 요청을 보냈습니다.
          <br />
          <button
            className="btn btn-outline btn-sm me-2"
            onClick={() => handlerAccept(msgId)}
          >
            수락
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handlerReject(msgId)}
          >
            거절
          </button>
        </div>
      );
    }
    return msg;
  };

  return (
    <div className="mt-16 px-36 flex align-center my-auto gap-3">
      <div className="card size-full bg-base-100 shadow-xl mb-5 mt-3 w-1/3">
        <div className=" text-center  text-2xl font-bold border-b-2 py-3">
          My Info
          <a
            className="btn btn-sm float-end align-center me-2 text-base font-normal"
            href={"/member/mypage/edit"}
          >
            <PencilSquareIcon className="w-5" />
          </a>
        </div>

        <div className="card-body gap-6">
          <div>
            <label
              htmlFor="Username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2 flex items-center">
              <img
                className="h-12 w-12 object-cover rounded-full border me-3"
                id="preview"
                src={data && data.memberImgPath}
                alt="Current profile photo"
              />
              <input
                type="text"
                name="username"
                value={data && data.username}
                className="block w-full rounded-md border-0 h-9 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="Email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="email"
                value={data && data.email}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="CreateDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Create date
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="createDate"
                value={createDate}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card size-full bg-base-100 h-96 shadow-xl mb-5 mt-3 w-2/3">
        <div className=" text-center  text-2xl font-bold border-b-2 py-3">
          My Message
        </div>
        <div className="flex">
          <div className="w-1/2">
            <div className=" px-3 text-center py-2 text-2xl font-bold">
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
            <div className="overflow-auto gap-3 py-1 px-3 h-64">
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
                  {data && data.id === member.id ? (
                    ""
                  ) : (
                    <button
                      onClick={() => handlerMessage(member.id, member.username)}
                      className="btn btn-outline btn-sm"
                    >
                      message
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <div className=" py-5 text-center">Messages</div>
            <div className="h-64 px-4 overflow-auto">
              {messageMember.map((member) => (
                <div
                  className="flex justify-between items-center py-2 "
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
                    onClick={() => handlerMessage(member.id, member.username)}
                    className="btn btn-outline btn-sm"
                  >
                    message
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                className="w-2/3"
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 ">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="text-center gap-3">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Send Message to{" "}
                        {receiverMember && receiverMember.username}
                      </Dialog.Title>
                      <div className="text-centerh-60 h-96 my-3 overflow-auto">
                        {messages &&
                          messages.map((message) =>
                            message.sender.id === data.id ? (
                              <div className="my-5  me-3">
                                <div className="flex justify-end items-center">
                                  <img
                                    className="h-10 w-10 object-cover rounded-full border me-2"
                                    id="preview2"
                                    src={message.sender?.memberImgPath}
                                    alt="MemberProfile"
                                  />
                                  {message.sender.username}
                                </div>
                                <div className="flex justify-end mt-3">
                                  <div className=" border rounded w-fit py-1 px-3 border-blue-500">
                                    {messageParsing(
                                      message.content,
                                      message.id
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="my-5  ms-3">
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 object-cover rounded-full border me-2"
                                    id="preview2"
                                    src={message.sender?.memberImgPath}
                                    alt="MemberProfile"
                                  />
                                  {message.sender.username}
                                </div>
                                <div className="flex mt-3">
                                  <div className=" border rounded w-fit py-1 px-3 border-green-500">
                                    {messageParsing(
                                      message.content,
                                      message.id
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        <div ref={messageEndRef}></div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="content"
                          required
                          className="content rounded-md w-full border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-300 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        sendMessage();
                      }}
                    >
                      send
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
