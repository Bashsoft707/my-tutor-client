import { MdOutlineLogout } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { useState } from "react";
import { UserProfile } from "../Profile";

export const Modal = () => {
  const [openUserProfileModal, setOpenUserProfileModal] = useState(false);
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {openUserProfileModal && (
        <UserProfile
          isOpen={openUserProfileModal}
          onClose={() => setOpenUserProfileModal(false)}
        />
      )}

      <div className="bg-[#343541] text-white p-3">
        <div
          className="flex items-center gap-[0.5rem] p-[0.5rem] cursor-pointer"
          onClick={() => setOpenUserProfileModal(!openUserProfileModal)}
        >
          <CiSettings />
          <h4>Settings</h4>
        </div>
        <div
          className="flex items-center gap-[0.5rem] p-[0.5rem] cursor-pointer"
          onClick={logout}
        >
          <MdOutlineLogout />
          Logout
        </div>
      </div>
    </>
  );
};
