"use client";

import api from "@/app/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditMember() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const doSubmmit = async (e) => {
    e.preventDefault();

    if (inputValid() == false) {
      e.stopPropagation();
      return;
    }

    const formData = new FormData();
    formData.append("username", data && data.username);
    formData.append("password", editMember.password);
    formData.append("passwordConfirm", editMember.passwordConfirm);
    formData.append("email", data && data.email);
    formData.append("profileImg", editMember.profileImg);

    await api.patch("/api/v1/members/edit", formData).then((res) => {
      alert(res.data.msg);

      if (res.data.isFail) {
        inputFocus(res.data.data);
        return;
      }

      router.push("/member/mypage");
    });
  };

  const mutation = useMutation({
    mutationFn: doSubmmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loginedMember"] });
    },
  });

  const [editMember, setEditMember] = useState({
    password: "",
    passwordConfirm: "",
    profileImg: "",
  });

  const { isLoading, data } = useQuery({
    queryKey: ["loginedMember"],
  });

  if (isLoading) return;

  if (data == null) {
    router.push("/");
  }

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  const handlerImg = (e) => {
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview")?.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(file);

    setEditMember({ ...editMember, profileImg: file });

    console.log(editMember);
  };

  function inputFocus(inputName: string) {
    const inputElement = document.getElementsByName(inputName);
    inputElement[0]?.focus();
  }

  function inputValid() {
    if (editMember.password != "" || editMember.passwordConfirm != "") {
      if (editMember.password == "") {
        alert("비밀번호를 입력해 주세요");
        inputFocus("password");
        return false;
      }
      if (editMember.passwordConfirm == "") {
        alert("비밀번호 확인을 입력해 주세요");
        inputFocus("passwordConfirm");
        return false;
      }

      if (editMember.password !== editMember.passwordConfirm) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        inputFocus("password");
        return false;
      }
    }

    return true;
  }

  return (
    <div className="mt-24 px-36 flex h-100 justify-center align-center my-auto">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <div className="text-3xl font-bold mb-5">DocuHub</div>
            <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Update member profile
            </h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-3">
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
                    value={data && data.username}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled
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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="passwordConfirm"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    PasswordConfirm
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    name="passwordConfirm"
                    onChange={handlerChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    value={data && data.email}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="profileImg"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ProfileImg
                  </label>
                </div>
                <div className="flex mt-2">
                  <div className="w-3/12 flex justify-center items-center">
                    <img
                      className="h-16 w-16 object-cover rounded-full border"
                      id="preview"
                      src={data && data.memberImgPath}
                      alt="Current profile photo"
                    />
                  </div>

                  <div className="w-9/12 flex items-center ">
                    <input
                      type="file"
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                      name="profileImg"
                      id="profileImg"
                      onChange={handlerImg}
                      accept="image/gif,image/jpeg,image/png"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={mutation.mutate}
                  className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
