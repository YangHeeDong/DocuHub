"use client";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["loginedMember"],
  });

  if (isLoading) return;

  const handlerTeamCreate = () => {
    if (data === null) {
      alert("로그인 후 이용해 주세요");
      router.push("/member/login");
      return;
    }
    router.push("/team/create");
  };

  return (
    <div className="relative isolate">
      <div
        className="absolute inset-x-0 -top-40 -z-30 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto py-32">
        <div className="text-center mt-36">
          <div className="flex items-center justify-center font-mono text-7xl font-bold tracking-tight text-gray-900">
            <div className="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                className="w-16 h-16 me-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            </div>
            DocuHub
          </div>
          <h1 className="text-5xl mt-2 font-bold tracking-tight text-gray-900">
            실시간 온라인 문서 공유 솔루션
          </h1>
          <p className="mt-6 text-lg leading-6 text-gray-600">
            DocuHub는 실시간 온라인 문서 공유 솔루션으로,
            <br /> 회원 간에 팀을 생성하여 실시간으로 문서를 관리하고 공유할 수
            있습니다.
            <br />
            회원들이 함께 작업하며 문서를 효율적으로 편집하고 업데이트할 수
            있습니다.
          </p>
          <div className="hidden sm:mb-8 sm:flex sm:justify-center mt-5">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <button
                onClick={handlerTeamCreate}
                className="font-semibold text-indigo-600"
              >
                <span className="absolute inset-0" aria-hidden="true" />팀
                생성하기 <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
