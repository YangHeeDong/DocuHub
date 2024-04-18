"use client";

import api from "@/app/utils/api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function editTeam() {
  const [team, setTeam] = useState(null);
  const router = useRouter();

  const id = useParams().id;

  const [member, setMember] = useState(null);
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

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setTeam({ ...team, [name]: value });
    console.log(team);
  };

  const handlerImg = (e) => {
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview")?.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(file);

    setTeam({ ...team, teamImg: file });
  };

  function inputFocus(inputName: string) {
    const inputElement = document.getElementsByName(inputName);
    inputElement[0]?.focus();
  }

  function inputValid() {
    if (team?.teamName == "") {
      alert("팀 이름을 입력해 주세요");
      inputFocus("teamName");
      return false;
    }
    if (team?.teamDescription == "") {
      alert("팀 설명을 입력해 주세요");
      inputFocus("teamDescription");
      return false;
    }
    return true;
  }

  const doSubmmit = async (e) => {
    e.preventDefault();

    if (inputValid() == false) {
      e.stopPropagation();
      return;
    }

    const formData = new FormData();
    formData.append("id", team.id);
    formData.append("teamName", team.teamName);
    formData.append("teamDescription", team.teamDescription);
    formData.append("teamImg", team.teamImg);

    await api
      .patch("/api/v1/team/edit", formData)
      .then((res) => {
        alert(res.data.msg);

        if (res.data.isFail) {
          inputFocus(res.data.data);
          return;
        }
        console.log(res);
        router.push("/team/" + team.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const isAdmin = () => {
    if (member && team && member.id !== team.teamAdmin.id) {
      router.back();
    }
  };

  useEffect(() => {
    getMember();
    getTeamById();
  }, []);

  useEffect(() => {
    isAdmin();
  }, [team]);

  return (
    <div className="px-24 flex h-100 justify-center align-center my-auto">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <div className="text-3xl font-bold mb-5">DocuHub</div>
            <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Edit a team
            </h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="teamName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Team name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="teamName"
                    onChange={handlerChange}
                    required
                    defaultValue={team && team.teamName}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="teamDescription"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Team description
                  </label>
                </div>
                <div className="mt-2">
                  <textarea
                    name="teamDescription"
                    onChange={handlerChange}
                    required
                    defaultValue={team && team.teamDescription}
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
                    Team img
                  </label>
                </div>
                <div className="flex mt-2">
                  <div className="w-3/12 flex justify-center items-center">
                    <img
                      className="h-16 w-16 object-cover rounded-full border"
                      id="preview"
                      src={team && team.teamImg.path}
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
                  onClick={doSubmmit}
                  className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Edit team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
