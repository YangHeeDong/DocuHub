'use client';

import { useEffect } from "react";
import api from "../utils/api";

export default function team() {

  const getTeams = () => {
    api.get("/api/v1/team/getTeams").then(res => {
      console.log(res.data);
      //console.log(res.data.data.json());

    })
  }

  useEffect( () => {

    getTeams();

  },[])

  return (
    
    <div className="px-24 flex justify-center align-center my-auto">
      
      <div className="card size-full bg-base-100 shadow-xl">
        <div className="flex border-b-2 py-3">
          <p className="">
            card title
          </p>
          <a href="/team/create" className="">
            create team
          </a>
        </div>
        
      <div className="card-body">
        <div className="grid grid-cols-4 gap-14">

        <a href="#" className="card bg-base-100 shadow-xl">
          <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" className="w-full h-40 object-contain bg-slate-200" alt="Shoes" /></figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </a>

        <a href="#" className="card bg-base-100 shadow-xl">
          <figure><img src="https://cdn.spotvnews.co.kr/news/photo/202212/572523_797960_5232.jpg" className="w-full h-40 object-contain bg-slate-200" alt="Shoes" /></figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </a>
          

          
        </div>
      </div>
      </div>
    </div>
    
  );
}
