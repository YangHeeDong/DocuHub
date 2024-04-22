"use client";

import api from "@/app/utils/api";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { Client, IMessage } from "@stomp/stompjs";
import { useQuery } from "@tanstack/react-query";

export default function articleDetail() {
  const id = useParams().id;

  const router = useRouter();
  const [member, setMember] = useState({ id: 0, username: "" });

  const [article, setArticle] = useState();
  const textRef = useRef<Editor>(null);

  const [stompClient, setStompClient] = useState<Client | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["loginedMember"],
  });

  const handleChangeInput = () => {
    const html = textRef.current?.getInstance().getMarkdown();
    setArticle((prevArticle) => ({ ...prevArticle, content: html }));
    sendMessage(html);
  };

  const updateArticle = function (message: IMessage) {
    if (textRef.current?.getInstance().getMarkdown() !== message.body) {
      textRef.current?.getInstance().setMarkdown(message.body);
    }
  };

  const getArticleById = async () => {
    await api.get(`/api/v1/articles/getArticle/` + id).then((res) => {
      if (res.data.isFail) {
        alert(res.data.msg);
        router.back();
        return;
      }
      setArticle(res.data.data.article);
    });
  };

  const getMember = async () =>
    await api
      .get("/api/v1/members/me")
      .then((res) => {
        console.log(res);
        if (res.data.isFail) {
          router.push("/");
        }
        setMember({
          ...member,
          id: res.data.data.id,
          username: res.data.data.username,
        });
      })
      .catch(function (error) {
        router.push("/");
      });

  const getMarkdown = async () => {
    const html = document.getElementsByClassName(
      "toastui-editor-contents"
    )[0] as HTMLElement;
    const canvas = await html2canvas(html);
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const doc = new jsPDF("p", "mm", "a4", true);
    let position = 0;

    doc.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;
    }
    // doc.save();
    // const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    doc.save("filename" + new Date().getTime() + ".pdf");
  };

  useEffect(() => {
    getMember();
    getArticleById();

    const client = new Client({
      brokerURL: "ws://localhost:8010/article", // 서버 WebSocket URL
      reconnectDelay: 5000,
    });

    client.onConnect = function () {
      // 구독 활성화
      client.subscribe(`/topic/public/article/${id}`, updateArticle);

      // 연결된 상태에서 메시지 전송
      if (client.connected) {
        console.log("1");
        client.publish({
          destination: `/app/article/${id}/connect`,
          body: JSON.stringify({
            id: id,
            content: "",
            memberId: member?.id,
          }),
        });
      }
    };
    client.activate();
    setStompClient(client);

    client.onDisconnect = function () {
      client.publish({
        destination: `/app/article/${id}/disconnect`,
        body: JSON.stringify({
          id: id,
          content: "",
          memberId: member?.id,
        }),
      });
    };

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = (html: string) => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/article/${id}/send`,
        body: JSON.stringify({ id: id, content: html, memberId: member?.id }),
      });
    }
  };

  const deleteArticle = async () => {
    if (!confirm("삭제한 문서는 되돌릴 수 없어요.\n삭제 하시겠습니까?")) {
      return;
    }

    await api
      .delete("/api/v1/articles/" + article?.id)
      .then((res) => {
        alert(res.data.msg);
        if (res.data.isFail) {
          router.push("/");
        }
        router.back();
      })
      .catch(function (error) {
        router.push("/");
      });
  };

  return (
    <div className="mt-16 px-36 flex justify-center align-center my-auto">
      <div className="card bg-base-100 w-full shadow-xl mt-4">
        <div className="text-center border-b-2 py-3 text-2xl font-bold">
          {article && article.title}
          <button
            onClick={deleteArticle}
            className="btn btn-sm float-end align-center me-2 text-base font-normal bg-slate-50"
          >
            <TrashIcon className="w-5 fill-red-500 " />
          </button>
          <button
            onClick={getMarkdown}
            className="btn btn-sm float-end align-center me-2 text-base font-normal bg-slate-50"
          >
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
