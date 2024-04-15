'use client';

import api from "@/app/utils/api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import teamDropDown from "@/app/utils/teamDropDown";

export default function createTeam() {

  const [team,setTeam] = useState();
  const router = useRouter();

  const id = useParams().id;

  const getTeamById = async () => {

    const data = await api.get(`/api/v1/team/getTeam/`+id).then(res => {
      console.log(res.data);

      if(res.data.isFail){
        alert(res.data.msg);
        router.push("/");
        return;
      }

      setTeam(res.data.data.team);
    })

  }

  useEffect( () => {getTeamById()},[])

  return (
    <div className="px-36  h-100 justify-center align-center my-auto ">

      <div className="flex gap-3">
        <div className="card bg-base-100 w-2/3 shadow-xl">
          <div className=" text-center border-b-2 py-3 text-2xl font-bold">
            {team && team.teamName}



            <div className="float-end inline-block me-3">
              {teamDropDown()}
            </div>

          </div>
          <div className="card-body">
            
            <div className=" grid grid-cols-3 gap-2">
              <div className="bg-slate-200">
                <figure><img src={team && team.teamImg.path} className="object-contain bg-slate-200" alt={ team && team.teamImg.originalFileName} /></figure>
                {/* <figure><img src="https://cdn.spotvnews.co.kr/news/photo/202212/572523_797960_5232.jpg" className="w-50 h-50 object-contain bg-slate-200" alt={ team && team.teamImg.originalFileName} /></figure> */}
                
              </div>
              <div className="col-span-2">
                <div>
                  {team && team.teamDescription}
                </div>
                <div className="text-end">
                  {team && team.teamAdmin.username}
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="card bg-base-100 w-1/3 shadow-xl">
          <div className="text-center border-b-2 py-3 text-2xl font-bold">
            Members
          </div>
          <div className="card-body overflow-auto">
            {team && team.teamMemberList.map(member => (
              <div key={member.id}>
                {member.username}
              </div>
            )
            )}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 w-full shadow-xl mt-4">
        <div className="text-center border-b-2 py-3 text-2xl font-bold">
          Document
        </div>
        <div className="card-body">
          문서 리스트
        </div>
      </div>


    </div>
    
  );
}
