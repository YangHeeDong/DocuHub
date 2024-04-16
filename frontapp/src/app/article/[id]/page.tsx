'use client';

import api from "@/app/utils/api";
import { TrashIcon } from "@heroicons/react/20/solid";
import {  } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Client, IMessage } from "@stomp/stompjs";

export default function articleDetail() {
  const id = useParams().id;
  
  const router = useRouter();

  const [article, setArticle] = useState({});
  const textRef = React.createRef();

  const [stompClient, setStompClient] = useState<Client | null>(null);
  
  const handleChangeInput = () => {
    const html = textRef.current?.getInstance().getMarkdown();
    setArticle({...article,"content":html});
    console.log(article);
    sendMessage(html);
  }

  const getArticleById = async () => {
    const data = await api.get(`/api/v1/articles/getArticle/`+id).then(res => {
      console.log(res.data);

      if(res.data.isFail){
        alert(res.data.msg);
        router.back();
        return;
      }
      setArticle(res.data.data.article)
      
    })
  }

  useEffect ( () => {
    getArticleById();
  } ,[])

  useEffect(() => {
    console.log("돌아요~");
    const client = new Client({
      brokerURL: "ws://localhost:8010/chat", // 서버 WebSocket URL
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/public/rooms/${id}`, (message: IMessage) => {
          if(article){
            console.log(message);
            setArticle({...article, content:message.body});
          }else{
            console.log("이상해");
          }
          
        });
      },
    });
    client.activate();
    setStompClient(client);
    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = (html:string) => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/chat/rooms/${id}/send`,
        body: JSON.stringify({id:id, content:html}) ,
      });
      console.log("보내기 끝났어요");
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
            {article.content && (
                <Editor
                  ref={textRef}
                  name="content"
                  previewStyle="vertical"
                  initialValue={article.content}
                  height="500px"
                  onChange={handleChangeInput}
                />
              )}
          
        </div>

      </div>
    </div>
  );
}
