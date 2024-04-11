'use client';

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
    inputElement[0]?.focus();
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

    const response = await fetch("http://localhost:8010/api/v1/members/findId",{
      method:"POST",
      headers:{'Content-Type':"application/json"},
      body:JSON.stringify(info)
    }).then(res => res.json());

    alert(response.msg);
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

    const response = await fetch("http://localhost:8010/api/v1/members/findPassword",{
      method:"POST",
      headers:{'Content-Type':"application/json"},
      body:JSON.stringify(info)
    }).then(res => res.json());

    alert(response.msg);
  }

  return (
    
    <div className="flex justify-center align-center my-auto">
      
      
      <div className="card w-96 bg-base-100 shadow-xl mt-3">
        <div className="card-body">
          <div className="text-center text-3xl font-bold gap-2">
            DocuHub
          </div>

          <div className="mt-5">
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
              <input type="email" name="email" onChange={handlerChange} className="grow" placeholder="Email" required />
            </label>

            <button onClick={findId} className="btn w-full mt-2">아이디찾기</button>
          </div>
          
          <div className="mt-5">
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
              <input type="text" name="username" onChange={handlerChange} placeholder="Username" required 
                      className="grow "
                        />
            </label>

            <label className="input input-bordered flex items-center mt-2 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
              <input type="email" name="email" onChange={handlerChange} className="grow" placeholder="Email" required />
            </label>

            <button onClick={findPassword} className="btn mt-2 w-full">비밀번호 찾기</button>
          </div>
          

        </div>

      </div>
    </div>
    
  );
}
