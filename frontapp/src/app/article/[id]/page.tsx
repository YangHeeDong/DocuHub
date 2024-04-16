'use client';

import api from "@/app/utils/api";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Client, IMessage } from "@stomp/stompjs";

export default function articleDetail() {
  const id = useParams().id;
  
  const router = useRouter();
  const [member, setMember] = useState({id:0, username:""});
  

  const [article, setArticle] = useState(null);
  const textRef = useRef<Editor>(null);


  const [stompClient, setStompClient] = useState<Client | null>(null);
  
  const handleChangeInput =  () => {
    const html = textRef.current?.getInstance().getMarkdown();
    setArticle(prevArticle => ({ ...prevArticle, content: html }));
    sendMessage(html);
  };

  const updateArticle = function (message:IMessage) {

    setArticle(prevArticle => ({ ...prevArticle, content: message.body }));
    textRef.current?.getInstance().setMarkdown(message.body);

  }

  const getArticleById = async () => {
    const data = await api.get(`/api/v1/articles/getArticle/`+id).then(res => {

      if(res.data.isFail){
        alert(res.data.msg);
        router.back();
        return;
      }

      setArticle(res.data.data.article);
      return article;
    })

    return data;
  }

  const getMember = async () => await api.get("/api/v1/members/me")
            .then(
            res => {
                console.log(res);
                setMember({ ...member, id: res.data.data.id, username : res.data.data.username });
            }
            ).catch(function (error) {
            console.log(error);
            });

  useEffect ( () => {
    getMember();

    getArticleById();
    console.log(article);
    const client = new Client({
      brokerURL: "ws://localhost:8010/article", // 서버 WebSocket URL
      reconnectDelay: 5000,
    });

    client.onConnect = function () {
      client.subscribe(`/topic/public/article/${id}`, updateArticle);
    };
    client.activate();
    setStompClient(client);
    
    return () => {
      client.deactivate();
    };
  } ,[])

  const sendMessage = (html:string) => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/article/${id}/send`,
        body: JSON.stringify({id:id, content:html,memberId:member?.id}) ,
      });
    }
  };
  
  return (
    <div className="px-36 flex justify-center align-center my-auto">
      
      <div className="card bg-base-100 w-full shadow-xl mt-4">
        <div className="text-center border-b-2 py-3 text-2xl font-bold">
          {article && article.title}
          <button className="btn btn-sm float-end align-center me-2 text-base font-normal bg-slate-50" >
              < TrashIcon className="w-5 fill-red-500 " />
          </button>
        </div>
        
        <div className="card-body">
            {article && (
                <Editor
                  ref={textRef}
                  name="content"
                  previewStyle="vertical"
                  initialValue={article.content}
                  height="500px"
                  onKeyup={handleChangeInput}
                />
              )}
          
        </div>

      </div>
    </div>
  );
}

