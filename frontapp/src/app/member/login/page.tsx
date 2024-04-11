'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function login() {

  const [login,setLogin] = useState({username:"",password:""})
  const router = useRouter();

  const handlerChange = (e) => {

    const {name, value} = e.target;
    setLogin({...login,[name]:value});

  }

  function inputFocus ( inputName:string ) {
    const inputElement = document.getElementsByName(inputName);
    inputElement[0]?.focus();
  }

  function inputValid () {
    if(login.username == ""){
      alert("이름을 입력해 주세요");
      inputFocus("username");
      return false;
    }
    if(login.password == ""){
      alert("비밀번호를 입력해 주세요");
      inputFocus("password");
      return false;
    }
    return true;
  }

  const doSubmmit = async () => {

    if(inputValid() == false){
      return;
    }

    const response = await fetch("http://localhost:8010/api/v1/members/login",{
      method:"POST",
      credentials: 'include', // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
      headers:{'Content-Type':"application/json"},
      body:JSON.stringify(login)
    }).then(res => res.json());

    console.log(response);

    alert(response.msg);

    if(response.isFail){
      inputFocus(response.data);
      return;
    }

    router.push("/");

  }

  return (
    
    <div className="flex justify-center align-center my-auto">
      
      <div className="card w-96 bg-base-100 shadow-xl mt-3">
        <div className="card-body">
          <div className="text-center text-3xl font-bold gap-2">
            DocuHub
          </div>
          <label className="input input-bordered flex items-center gap-2 ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input type="text" name="username" onChange={handlerChange} placeholder="Username" required 
                    className="grow "
                      />
          </label>

          <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input type="password" name="password" onChange={handlerChange} className="grow" placeholder="Password" required />
          </label>
          
          
          <button onClick={doSubmmit} className="btn btn-outline btn-success btn-sm ps-5 pe-5">로그인</button>

          <div className="flex justify-between">
            
            <Link href="/member/findMember" className="btn btn-outline btn-info btn-sm">ID/PW 찾기</Link>
            <Link href="/member/signup" className="btn btn-outline btn-info btn-sm">회원가입</Link>
            
          </div>
          
        </div>
      </div>
      
      
        
    </div>
    
  );
}
