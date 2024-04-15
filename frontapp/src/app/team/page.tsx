'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import api from "../utils/api";

export default function team() {

  const [teams, setTeams] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();
  
  const page:number = searchParams.get("page") === null ? 0 : Number(searchParams.get("page"));

  const getTeams = async () => {

    const data = await api.get(`/api/v1/team/getTeams?page=${page}`).then(res => {
      console.log(res.data.data.teams);
      return res.data.data.teams;
    })

    setTeams(await data);
    setTotalPages(data.totalPages);
  }

  const rendering = () => {
    if(page === 0){
      return pageATag(0,2);
    }else if(Number(page+1) === Number(totalPages)){
      return pageATag(page-2,page);
    }else{
      return pageATag(page-2,Number(page+2));
    }
  };

  const pageATag = (start:number,end:number) => {
    const result = [];
    var s = start < 0 ? 0 : start;
    var e = 0;
    if(totalPages <= 2){
      e = totalPages-1;
    }else{
      e = totalPages-1 < end ? totalPages-1 : end;
    }
    for (let i = s; i <= e; i++) {
      if(i == page){
        result.push(
          <button
              disabled
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {i + 1}
            </button>
        );
      }else{
        result.push(
          <a
            href={"/team?page="+(i)}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {i + 1}
          </a>
        );
      }
    }
    return result;
  }

  useEffect( () => {
    getTeams();
  },[])

  return (
    
    <div className="px-36 flex justify-center align-center my-auto">
      
      <div className="card size-full bg-base-100 shadow-xl mb-5 mt-3">
        <div className="flex border-b-2 py-3">
          <p className="">
            card title
          </p>
          <a href="/team/create" className="">
            create team
          </a>
        </div>
        
      <div className="card-body">
        <div className="grid grid-cols-4 gap-6">
        {teams && teams.content.map(team => (
          <a href={"/team/"+team.id} key={team.id} className="card bg-base-100 shadow-xl">
            <figure><img src={team.teamImg.path} className="w-full h-40 object-contain bg-slate-200" alt={team.teamImg.originalFileName} /></figure>
            <div className="card-body">
              <h2 className="card-title truncate">{team?.teamName}</h2>
              <p className="truncate">{team?.teamDescription}</p>
              <div className="truncate text-end">
                {team?.teamAdmin.username}
              </div>
            </div>
          </a>
        ))}
          
        </div>
      </div>


      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* 이전버튼 */}
        { teams && teams.number === 0 ? 
          <button
            disabled
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300 "
          >
            Previous
          </button> 
        : 
        <a
            href={"/team?page="+(page-1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a> 

        }

        {/* 다음버튼 */}
        { teams && teams.totalPages === page ? 
          <button
            disabled
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300 "
          >
            Next
          </button> 
        : 
        <a
            href={"/team?page="+ (Number(page)+1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a> 

        } 
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{teams && (teams.number + 1) }</span> to <span className="font-medium">{teams && teams.totalPages}</span> of{' '}
            <span className="font-medium">{teams && teams.totalElements}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {rendering()}
          </nav>
        </div>
      </div>
    </div>



      </div>
    </div>
    
  );
}
