import { MdOutlineLogout } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

export const Modal = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-[#343541] text-white p-3">
      <div className="flex items-center gap-[0.5rem] p-[0.5rem] cursor-pointer">
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
  );
};
