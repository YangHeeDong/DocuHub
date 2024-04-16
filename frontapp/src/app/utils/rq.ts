import { useRouter } from "next/navigation";
import api from "./api";
import { useState } from "react";
import findMember from "../member/findMember/page";

class Rq {
    
  member = { id: 0, username: ''};
    router = useRouter();
  constructor() {
    this.member = { id: 0, username: ''};
  }

  getMember() {
    return this.member;
  }

  setLogined(username:string, password:string) {
  }

  async setLogout() {
  }

  isLogin() {
      return this.member.id !== 0;
  }

  isLogout() {
      return !this.isLogin();
  }

  async initAuth() {
  }
}

const useRq = () => {
    const [member, setMember] = useState({ id: 0, username: '' });
    const rq = new Rq();

    rq.member = member;

    rq.getMember = () => {
        return member;
    }

    rq.initAuth = async() => {
        const data = await api.get("/api/v1/members/me")
        .then(
        res => {
            if(res.data.isFail){
                rq.setLogout();
            }
            setMember({ id: res.data.id, username : res.data.username });

            return res.data.id;
        }
        ).catch(function (error) {
        console.log(error);
        });
        return data;
    }

    rq.setLogined = async(username,password) => { 
        await api.post("/api/v1/members/login",{username:username, password:password})
            .then(
            res => {
                alert(res.data.msg)
                
                if(res.data.isFail){
                return res.data.data;
                }
                if(res.data.isSuccess){
                    setMember({ id: res.data.data.memberDto.id, username : res.data.data.memberDto.username });
                }
                rq.router.push('/');
            }
            )
            .catch(function (error) {
            console.log(error);
            });
    } ;
    
    rq.setLogout = async() => {
        setMember({ id: 0, username : "" });
        await api.post("http://localhost:8010/api/v1/members/logout");
    }

    return rq;
};
export default useRq;