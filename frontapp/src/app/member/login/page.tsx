"use client";

import useRq from "@/app/utils/rq";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function login() {
  const [login, setLogin] = useState({ username: "", password: "" });
  const router = useRouter();
  const rq = useRq();

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  function inputFocus(inputName: string) {
    const inputElement = document.getElementsByName(inputName);
    inputElement[0]?.focus();
  }

  function inputValid() {
    if (login.username == "") {
      alert("이름을 입력해 주세요");
      inputFocus("username");
      return false;
    }
    if (login.password == "") {
      alert("비밀번호를 입력해 주세요");
      inputFocus("password");
      return false;
    }
    return true;
  }

  const doSubmmit = async () => {
    if (inputValid() == false) {
      return;
    }
    await rq.setLogined(login.username, login.password);
  };

  return (
    <div className="px-36 flex h-fit justify-center align-center my-auto">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <div className="text-3xl font-bold mb-5">DocuHub</div>
            <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="Username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="username"
                    onChange={handlerChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="/member/findMember"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot ID/PW ?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    onChange={handlerChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={doSubmmit}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              Not a member?{" "}
              <a
                href="/member/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up for DocuHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
