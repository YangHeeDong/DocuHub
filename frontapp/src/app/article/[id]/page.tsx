'use client';

import api from "@/app/utils/api";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from 'html2canvas-pro';
import jsPDF from "jspdf";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Client, IMessage } from "@stomp/stompjs";

export default function articleDetail() {
  const id = useParams().id;
  
  const router = useRouter();
  const [member, setMember] = useState({id:0, username:""});
  

  const [article, setArticle] = useState();
  const textRef = useRef<Editor>(null);


  const [stompClient, setStompClient] = useState<Client | null>(null);
  
  const handleChangeInput =  () => {
    const html = textRef.current?.getInstance().getMarkdown();
    setArticle(prevArticle => ({ ...prevArticle, content: html }));
    sendMessage(html);
  };

  const updateArticle = function (message:IMessage) {
    if(textRef.current?.getInstance().getMarkdown() !== message.body){
      textRef.current?.getInstance().setMarkdown(message.body);
    }
  }

  const getArticleById = async () => {
    await api.get(`/api/v1/articles/getArticle/`+id).then(res => {

      if(res.data.isFail){
        alert(res.data.msg);
        router.back();
        return;
      }

      setArticle(res.data.data.article);
    })
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

  const getMarkdown = async () => {
    const html= document.getElementsByClassName("toastui-editor-contents")[0] as HTMLElement;
    const canvas = await html2canvas(html);
    const imgData = canvas.toDataURL('image/png');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
  
    const doc = new jsPDF('p', 'mm', 'a4', true);
    let position = 0;
  
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }
    // doc.save();
    // const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    doc.save('filename' + new Date().getTime() + '.pdf');
  };

  const html2pdf = async () => {
    const html= document.getElementsByClassName("toastui-editor-contents")[0] as HTMLElement;
    //1.html을 들고와서 canvas화
    const canvas = await html2canvas(html!,{scale:3});
    //2.이미지화
    const imageFile = canvas.toDataURL('image/png');
    //3.pdf준비
    const doc = new jsPDF('p', 'mm', 'a4');
    //pdf 가로 세로 사이즈
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    //이미지의 길이와 pdf의 가로길이가 다르므로 이미지 길이를 기준으로 비율을 구함
    const widthRatio = pageWidth / canvas.width;
    //비율에 따른 이미지 높이
    const customHeight = canvas.height * widthRatio;
    //pdf에 1장에 대한 이미지 추가
    doc.addImage(imageFile, 'png', 0, 0, pageWidth, customHeight);
    //doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    //감소하면서 남은 길이 변수
    let heightLeft = customHeight;
    //증가하면서 이미지 자를 위치 변수
    let heightAdd = -pageHeight;

    // 한 페이지 이상일 경우
    while (heightLeft >= pageHeight) {
        //pdf페이지 추가
        doc.addPage();
        //남은 이미지를 추가
        doc.addImage(imageFile, 'png', 0, heightAdd, pageWidth, customHeight);
        //남은길이
        heightLeft -= pageHeight;
        //남은높이
        heightAdd -= pageHeight;
    }
    //문서저장
    doc.save('filename' + new Date().getTime() + '.pdf');
};

  useEffect ( () => {

    getMember();
    getArticleById();
    
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
          <button onClick={getMarkdown} className="btn btn-sm float-end align-center me-2 text-base font-normal bg-slate-50" >
              추출
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

