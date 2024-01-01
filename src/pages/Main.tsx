import { useState, useEffect, useRef } from "react";
import { BiPlus, BiComment, BiUser, BiFace, BiSend } from "react-icons/bi";
import "./Main.css";
import { CreateProfileModal, Modal } from "../components";

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
  const scrollToLastItem: any = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") as string);
  console.log("user", user);

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
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();

      if (data.error) {
        setErrorText(data.error.message);
        setText("");
      } else {
        setErrorText(false);
      }

      if (!data.error) {
        setMessage(data.choices[0].message);
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

  const currentChat = previousChats.filter(
    (prevChat: any) => prevChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat: any) => prevChat.title).reverse())
  );

  return (
    <>
      {isCreateProfileModalOpen && (
        <CreateProfileModal
          isOpen={isCreateProfileModalOpen}
          onClose={() => setIsCreateProfileModalOpen(false)}
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
          {!currentTitle && (
            <div className="empty-chat-container">
              <h1>My Tutor</h1>
              <h3>How can I help you today?</h3>
            </div>
          )}
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
