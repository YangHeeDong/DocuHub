'use client';

import api from "@/app/utils/api";
import { useState } from "react";

export default function findMember() {

  const [info,setInfo] = useState({username:"",email:""})

  const handlerChange = (e) => {

    const {name, value} = e.target;
    setInfo({...info,[name]:value});
    console.log(info)
  }

  function inputFocus ( inputName:string, index:number ) {
    const inputElement = document.getElementsByName(inputName);
    inputElement[index]?.focus();
  }


  const findId = async () => {

    const emailValue = document.getElementsByName("email")[0].value;
    setInfo({...info,email:emailValue});


    if(info.email == ""){
      alert("이메일을 입력해 주세요");
      inputFocus("email",0);
      return false;
    }

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if(regex.test(info.email) == false){
      alert("이메일 형식이 맞지 않습니다.");
      inputFocus("email",0);
      return false;
    }

   await api.post("/api/v1/members/findId",info)
    .then(
      res => (alert(res.data.msg))
    )
    .catch(function (error) {
      console.log(error);
    });

  }

  const findPassword = async () => {
    
    const emailValue = document.getElementsByName("email")[1].value;
    setInfo({...info,email:emailValue});

    if(info.username == ""){
      alert("이름을 입력해 주세요");
      inputFocus("username",0);
      return false;
    }

    if(info.email == ""){
      alert("이메일을 입력해 주세요");
      inputFocus("email",1);
      return false;
    }

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if(regex.test(info.email) == false){
      alert("이메일 형식이 맞지 않습니다.");
      inputFocus("email",1);
      return false;
    }

    await api.post("/api/v1/members/findPassword",info)
    .then(
      res => (alert(res.data.msg))
    )
    .catch(function (error) {
      console.log(error);
    });

  }

  return (
    
    <div className="px-24 flex justify-center align-center my-auto">
      
      <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
          
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
              <div className="text-3xl font-bold mb-3">DocuHub</div>
              <div className="text-2xl font-bold ">Find your account</div>
          </div>

          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-3">
              <div>
                <label htmlFor="Email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input type="email" name="email" onChange={handlerChange} required 
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
              </div>

              <button
                onClick={findId}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5  text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Find Username
                </button>
            </div>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-3">

              <div> 
                <label htmlFor="Username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input type="text" name="username" onChange={handlerChange} required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
              </div>

              <div>
                <label htmlFor="Email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input type="email" name="email" onChange={handlerChange} required 
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
              </div>

              <button
                onClick={findPassword}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Find Password
                </button>
            </div>
          </div>
            <p className="mt-8 text-center text-sm text-gray-500">
              <a href="/member/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign in to DocuHub
              </a>
            </p>
      </div>

      </div>
    </div>
    
  );
}
