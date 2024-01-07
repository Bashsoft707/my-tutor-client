import { useState, useEffect, useRef } from "react";
import { BiPlus, BiComment, BiUser, BiFace, BiSend } from "react-icons/bi";
import "./Main.css";
import { CreateProfileModal, Modal, QuizModal, UserProfile } from "../components";
import Select from "react-select";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl";

export function MainPage() {
  const [text, setText] = useState<any>("");
  const [message, setMessage] = useState<any>(null);
  const [previousChats, setPreviousChats] = useState<any>([]);
  const [currentTitle, setCurrentTitle] = useState<any>(null);
  const [isResponseLoading, setIsResponseLoading] = useState<any>(false);
  const [errorText, setErrorText] = useState<any>("");
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] =
    useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openQuizModal, setOpenQuizModal] = useState<boolean>(false);
  const [course, setCourse] = useState("");
  const [dataSets, setDataSets] = useState([]);
  const scrollToLastItem: any = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") as string);

  const createNewChat = () => {
    setMessage(null);
    setText("");
    setCurrentTitle(null);
  };

  const backToHistoryPrompt = (uniqueTitle: any) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setText("");
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!text) return;

    setErrorText("");
    setIsResponseLoading(true);

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      // const response = await fetch(
      //   "http://localhost:8000/completions",
      //   options
      // );
      // const data = await response.json();
      const response: any = dataSets.find(
        (data: any) =>
          data.question.toLocaleLowerCase() === text.toLocaleLowerCase()
      );

      console.log("response", response);

      const message = {
        content: response.answer,
        role: "user",
      };

      console.log("message", message);

      if (!response) {
        setErrorText("Error in responding to sent text");
        setText("");
      } else {
        setErrorText(false);
      }

      if (response) {
        setMessage(message);
        setTimeout(() => {
          scrollToLastItem.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
          });
        }, 1);
        setTimeout(() => {
          setText("");
        }, 2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.profile) {
      // If the user does not have a profile, open the CreateProfileModal
      setIsCreateProfileModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!currentTitle && text && message) {
      setCurrentTitle(text);
    }

    if (currentTitle && text && message) {
      setPreviousChats((prevChats: any) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: text,
        },
        {
          title: currentTitle,
          role: message.role,
          content:
            message.content.charAt(0).toUpperCase() + message.content.slice(1),
        },
      ]);
    }
  }, [message, currentTitle]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${baseUrl}/get-datasets`);
      const data = response.data;

      const fieldData = getFieldData(
        data,
        course,
        user.profile?.knowledgeLevel
      );

      setDataSets(fieldData);
    };

    getData();
  }, [course, user.profile?.knowledgeLevel]);

  const getFieldData = (
    data: Record<string, Record<string, any>>,
    field: string,
    knowledgeLevel: string | undefined
  ) => {
    if (field && knowledgeLevel) {
      return data[field.toLowerCase()][knowledgeLevel.toLowerCase()] || [];
    }
    return [];
  };

  const currentChat = previousChats.filter(
    (prevChat: any) => prevChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat: any) => prevChat.title).reverse())
  );

  const interests = user.profile?.interests.map((interest: string) => ({
    label: interest.toLocaleUpperCase(),
    value: interest.toLocaleLowerCase(),
  }));

  return (
    <>
      {isCreateProfileModalOpen && (
        <CreateProfileModal
          isOpen={isCreateProfileModalOpen}
          onClose={() => setIsCreateProfileModalOpen(false)}
        />
      )}

      {openQuizModal && (
        <QuizModal
          isOpen={openQuizModal}
          onClose={() => setOpenQuizModal(false)}
          questions={dataSets}
        />
      )}

      <div className="container">
        <section className="sidebar">
          <div className="sidebar-header" onClick={createNewChat} role="button">
            <BiPlus size={20} />
            <button>New Chat</button>
          </div>
          <div className="sidebar-history">
            {uniqueTitles.length > 0 && <p>Today</p>}
            <ul>
              {uniqueTitles?.map((uniqueTitle: any, idx) => (
                <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                  <BiComment />
                  {uniqueTitle.slice(0, 18)}
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-header" role="button">
            <button
              className="capitalize text-center cursor-pointer w-full"
              disabled={
                dataSets.length === 0 || dataSets.length > uniqueTitles.length
              }
              onClick={() => setOpenQuizModal(!openQuizModal)}
            >
              take quiz
            </button>
          </div>
          <div className="sidebar-info">
            <div className="sidebar-info-upgrade">
              <BiUser />
              <p>Upgrade to Plus</p>
            </div>
            {openModal && <Modal />}
            <div
              className="sidebar-info-user"
              onClick={() => setOpenModal(!openModal)}
            >
              <BiFace />
              <p>{user?.username}</p>
            </div>
          </div>
        </section>

        <section className="main">
          <div className="flex items-center gap-1">
            <div className="interests ">
              <Select
                isClearable={true}
                placeholder="Select interests..."
                name="Ineterest"
                options={interests}
                value={interests.find(
                  (opt: { value: string }) => opt?.value === course
                )}
                onChange={(e) => setCourse(e?.value)}
              />
            </div>
            <div className="knowledge-level p-1.5 border-2 rounded border-slate-200">
              <h3 className="capitalize font-semibold">
                {user.profile?.knowledgeLevel}
              </h3>
            </div>
          </div>

          {!currentTitle &&
            (dataSets ? (
              <div className=" h-[80%] flex flex-col justify-center items-center text-white">
                <div className=" flex flex-wrap justify-around max-w-[900px]">
                  {dataSets.map((data: any, index) => (
                    <div
                      className=" text-lg font-light mt-3 p-3 border rounded cursor-pointer min-w-[400px] hover:bg-slate-800"
                      onClick={() => setText(data.question)}
                      key={index}
                    >
                      {data.question}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-chat-container">
                <h1>My Tutor</h1>
                <h3>How can I help you today?</h3>
              </div>
            ))}
          <div className="main-header">
            <ul>
              {currentChat?.map((chatMsg: any, idx: any) => (
                <li key={idx} ref={scrollToLastItem}>
                  <img
                    src={
                      chatMsg.role === "user"
                        ? "../public/face_logo.svg"
                        : "../public/ChatGPT_logo.svg"
                    }
                    alt={chatMsg.role === "user" ? "Face icon" : "ChatGPT icon"}
                    style={{
                      backgroundColor:
                        chatMsg.role === "user" ? "#FFF" : "#ECECF1",
                    }}
                  />
                  <p>{chatMsg.content}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="main-bottom">
            {errorText && <p className="errorText">{errorText}</p>}
            <form className="form-container" onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Send a message."
                spellCheck="false"
                value={
                  isResponseLoading
                    ? "Loading..."
                    : text.charAt(0).toUpperCase() + text.slice(1)
                }
                onChange={(e) => setText(e.target.value)}
                readOnly={isResponseLoading}
              />
              {!isResponseLoading && (
                <button type="submit">
                  <BiSend
                    size={20}
                    style={{
                      fill: text.length > 0 ? "#000" : "#ECECF1",
                    }}
                  />
                </button>
              )}
            </form>
            <p>
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

// import axios from "axios";
// import React, { useState } from "react";

// const examples = [
//   "How to use Tailwind CSS",
//   "How to use Tailwind CSS with React",
//   "How to use Tailwind CSS with Next.js",
//   "How to use Tailwind CSS with Gatsby",
//   "How to use Tailwind CSS with Svelte",
//   "How to use Tailwind CSS with Vue",
//   "How to use Tailwind CSS with Angular",
//   "How to use Tailwind CSS with Ember",
// ];

// export const MainPage = () => {
//   const [chat, setChat] = useState<any>([]);
//   const [chatHistory, setChatHistory] = useState<any>([]);
//   const [title, setTitle] = useState<any>("");
//   const [input, setInput] = useState<any>("");

//   const handleSend = async () => {
//     if (input.trim()) {
//       setChat([...chat, { role: "user", content: input }]);
//       setInput("");
//       const response: any = await fetch("http://localhost:8000/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messages: [...chat, { role: "user", content: input }],
//         }),
//       });

//       //eslint-disable-next-line
//       const readData = response?.body
//         .pipeThrough(new TextDecoderStream())
//         .getReader();
//       let aiRes = "";
//       while (true) {
//         const { done, value } = await readData.read();
//         if (done) {
//           break;
//         }
//         aiRes += value;
//         setChat([
//           ...chat,
//           { role: "user", content: input },
//           { role: "assistant", content: aiRes },
//         ]);
//       }

//       if (!title) {
//         const createTitle = await axios.post("http://localhost:8000/api/title", {
//             title: input
//         });

//         console.log("create title", createTitle)

//         const title = await createTitle.data;
//         setTitle(title?.title);
//         setChatHistory([...chatHistory, title]);
//       }
//     }
//   };

//   return (
//     <div className=" h-screen w-screen flex bg-[#050509]">
//       <div className=" w-[20%] h-screen bg-[#0c0c15] text-white p-4">
//         <div className=" h-[5%]">
//           <button
//             className=" w-full h-[50px] border rounded hover:bg-slate-600"
//             onClick={() => {
//               setChat([]);
//               setTitle("");
//             }}
//           >
//             New Chat
//           </button>
//         </div>
//         <div className=" h-[70%]  shadow-lg hide-scroll-bar mb-4">
//           {chatHistory.map((item: any, index: any) => (
//             <div className=" py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer">
//               <span className=" mr-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-message"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   stroke-width="2"
//                   stroke="currentColor"
//                   fill="none"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M8 9h8"></path>
//                   <path d="M8 13h6"></path>
//                   <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
//                 </svg>
//               </span>
//               <span className=" text-left">{item.title}</span>
//             </div>
//           ))}
//         </div>
//         <div className=" shadow-lg hide-scroll-bar h-[20%] border-t">
//           {[1].map((item, index) => (
//             <div className=" py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer">
//               <span className=" mr-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-settings-code"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   stroke-width="2"
//                   stroke="currentColor"
//                   fill="none"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M11.482 20.924a1.666 1.666 0 0 1 -1.157 -1.241a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.312 .318 1.644 1.794 .995 2.697"></path>
//                   <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
//                   <path d="M20 21l2 -2l-2 -2"></path>
//                   <path d="M17 17l-2 2l2 2"></path>
//                 </svg>
//               </span>
//               Settings
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className=" w-[80%]">
//         {chat.length > 0 ? (
//           <div className=" h-[80%]  hide-scroll-bar pt-8">
//             {chat.map((item: any, index: any) => (
//               <div
//                 className={` w-[60%] mx-auto p-6 text-white flex ${
//                   item.role === "assistant" && "bg-slate-900 rounded"
//                 }`}
//               >
//                 <span className=" mr-8 p-2 bg-slate-500 text-white rounded-full h-full ">
//                   {item.role === "user" ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="icon icon-tabler icon-tabler-user-bolt"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       stroke-width="2"
//                       stroke="currentColor"
//                       fill="none"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                     >
//                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                       <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
//                       <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076"></path>
//                       <path d="M19 16l-2 3h4l-2 3"></path>
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="icon icon-tabler icon-tabler-robot"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       stroke-width="2"
//                       stroke="currentColor"
//                       fill="none"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                     >
//                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                       <path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z"></path>
//                       <path d="M10 16h4"></path>
//                       <circle
//                         cx="8.5"
//                         cy="11.5"
//                         r=".5"
//                         fill="currentColor"
//                       ></circle>
//                       <circle
//                         cx="15.5"
//                         cy="11.5"
//                         r=".5"
//                         fill="currentColor"
//                       ></circle>
//                       <path d="M9 7l-1 -4"></path>
//                       <path d="M15 7l1 -4"></path>
//                     </svg>
//                   )}
//                 </span>
//                 <div
//                   className=" leading-loose"
//                   style={{ whiteSpace: "break-spaces" }}
//                 >
//                   {item.content}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className=" h-[80%] flex flex-col justify-center items-center text-white">
//             <div className=" text-4xl font-bold mb-8 text-capitalize">my tutor</div>
//             <div className=" flex flex-wrap justify-around max-w-[900px]">
//               {examples.map((item, index) => (
//                 <div
//                   className=" text-lg font-light mt-4 p-4 border rounded cursor-pointer min-w-[400px] hover:bg-slate-800"
//                   onClick={() => setInput(item)}
//                 >
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className=" h-[20%]">
//           <div className=" flex flex-col items-center justify-center w-full h-full text-white">
//             <div className=" w-[60%] flex justify-center relative">
//               <input
//                 type="text"
//                 onChange={(e) => setInput(e.target.value)}
//                 value={input}
//                 className=" w-full rounded-lg p-4 pr-16 bg-slate-800 text-white"
//                 placeholder="Type your message here..."
//               />
//               <span
//                 className=" absolute right-4 top-4 cursor-pointer"
//                 onClick={() => (input.trim() ? handleSend() : undefined)}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon icon-tabler icon-tabler-send"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   stroke-width="2"
//                   stroke="currentColor"
//                   fill="none"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M10 14l11 -11"></path>
//                   <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
//                 </svg>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
