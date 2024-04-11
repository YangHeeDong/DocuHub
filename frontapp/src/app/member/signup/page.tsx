'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function signup() {


  const [signup,setSignup] = useState({username:"",password:"",passwordConfirm:"",email:"",profileImg:""})
  const router = useRouter();

  const handlerChange = (e) => {

    const {name, value} = e.target;
    setSignup({...signup,[name]:value});
    
  }

  const handlerImg = (e) => {
    
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('preview')?.setAttribute("src",e.target.result);
    }
    reader.readAsDataURL(file);

    setSignup({...signup,profileImg:file});

    console.log(signup);
  }

  function inputFocus ( inputName:string ) {
    const inputElement = document.getElementsByName(inputName);
    inputElement[0]?.focus();
  }

  function inputValid () {
    if(signup.username == ""){
      alert("이름을 입력해 주세요");
      inputFocus("username");
      return false;
    }
    if(signup.password == ""){
      alert("비밀번호를 입력해 주세요");
      inputFocus("password");
      return false;
    }
    if(signup.passwordConfirm == ""){
      alert("비밀번호 확인을 입력해 주세요");
      inputFocus("passwordConfirm");
      return false;
    }

    if(signup.email == ""){
      alert("이메일을 입력해 주세요");
      inputFocus("email");
      return false;
    }

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if(regex.test(signup.email) == false){
      alert("이메일 형식이 맞지 않습니다.");
      inputFocus("email");
      return false;
    }
    
    if(signup.password !== signup.passwordConfirm){
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      inputFocus("password");
      return false;
    }

    return true;
  }

  const doSubmmit = async (e) => {

    e.preventDefault();
    
    if(inputValid() == false){
      e.stopPropagation();
      return;
    }

    const formData = new FormData();
    formData.append('username', signup.username);
    formData.append('password', signup.password);
    formData.append('passwordConfirm', signup.passwordConfirm);
    formData.append('email', signup.email);
    formData.append("profileImg",  signup.profileImg);

    const response = await fetch("http://localhost:8010/api/v1/members/signup",{
      method:"POST",
      // credentials: 'include', // 클라이언트와 서버가 통신할때 쿠키 값을 공유하겠다는 설정
      // headers:{"Content-Type": "multipart/form-data"},
      body:formData
    }).then(res => res.json());

    alert(response.msg);

    if(response.isFail){
      inputFocus(response.data);
      return;
    }

    // router.push("/");

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

          <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input type="password" name="passwordConfirm" onChange={handlerChange} className="grow" placeholder="PasswordConfirm" required />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
            <input type="email" name="email" onChange={handlerChange} className="grow" placeholder="Email" required />
          </label>

          <div className="flex">
            
            <div className="w-3/12 flex justify-center items-center">
              <img className="h-16 w-16 object-cover rounded-full" id="preview" src="" alt="Current profile photo" />
            </div>
            
            <div className="w-9/12 flex items-center ">
              <input type="file" className="file-input file-input-bordered w-full max-w-xs"
              name="profileImg" id="profileImg" onChange={handlerImg} accept="image/gif,image/jpeg,image/png" />    
            </div>
            
          </div>

          <button onClick={doSubmmit} className="btn">회원가입</button>
        </div>
      </div>
      
      
        
    </div>
    
  );
}
