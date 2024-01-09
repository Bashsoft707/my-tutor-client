import { useState, useEffect, useRef } from "react";
import { BiPlus, BiComment, BiUser, BiFace, BiSend } from "react-icons/bi";
import "./Main.css";
import {
  CreateProfileModal,
  LoadingSpinner,
  Modal,
  QuizModal,
} from "../components";
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
  const [expiredTokenModal, setExpiredTokenModal] = useState(false);
  const [course, setCourse] = useState("");
  const [dataSets, setDataSets] = useState([]);
  const scrollToLastItem: any = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") as string);
  const token = localStorage.getItem("token");
  const [userProfile, setUserProfile] = useState<any>(user?.profile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
    const getUserProfile = async () => {
      try {
        const response = await axios.get(`${baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          response.data.statusCode === 500 ||
          response.data.message === "jwt expired"
        ) {
          setExpiredTokenModal(true);
          return;
        }

        const { data } = response.data;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    getUserProfile();
  }, []);

  console.log("user profile", userProfile)

  useEffect(() => {
    if (!isLoadingProfile && !userProfile) {
      setIsCreateProfileModalOpen(true);
    }
  }, [userProfile, isLoadingProfile]);

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

      const fieldData = getFieldData(data, course, userProfile?.knowledgeLevel);

      setDataSets(fieldData);
    };

    getData();
  }, [course, userProfile?.knowledgeLevel]);

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

  const interests = userProfile?.interests.map((interest: string) => ({
    label: interest.toLocaleUpperCase(),
    value: interest.toLocaleLowerCase(),
  }));

  const openQuiz = () => {
    if (dataSets.length > 0 && dataSets.length <= uniqueTitles.length) {
      setOpenQuizModal(true);
    }
  };

  return (
    <>
      {isLoadingProfile && (
        <div className="z-50 w-screen h-screen fixed bg-gray-700 opacity-75 flex">
          <div className="my-auto mx-auto">
              <LoadingSpinner />
          </div>
        
        </div>
      )}
      {isCreateProfileModalOpen && !isLoadingProfile && (
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

      {expiredTokenModal && <ExpiredJwtModal isOpen={expiredTokenModal} />}

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
              onClick={openQuiz}
            >
              take quiz
            </button>
          </div>
          <div className="sidebar-info">
            {openModal && <Modal profile={userProfile} />}
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
                value={interests?.find(
                  (opt: { value: string }) => opt?.value === course
                )}
                onChange={(e) => setCourse(e?.value)}
              />
            </div>
            <div className="knowledge-level p-1.5 border-2 rounded border-slate-200">
              <h3 className="capitalize font-semibold">
                {userProfile?.knowledgeLevel}
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

const ExpiredJwtModal = ({ isOpen }: any) => {
  return (
    <div
      className={`fixed inset-0 overflow-y-auto ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-8 mb-3 font-medium text-gray-900">
                This session has expired, login again
              </h3>
              <button
                className="bg-[#343541] border-none text-white w-[100%] p-3 cursor-pointer"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
