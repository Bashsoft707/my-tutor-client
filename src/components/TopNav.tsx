import { IoMdNotificationsOutline } from "react-icons/io";
import { FiSettings, FiUser } from "react-icons/fi";

interface Props {
  title?: string;
}

export const TopNav = ({ title }: Props): JSX.Element => {
  return (
    <nav className="flex items-center h-20 gap-4 p-8 shadow-md bg-[#353535] text-white">
      <h2 className="mr-auto">User Name</h2>
      <IoMdNotificationsOutline className="w-6 h-6" />
      <div className="flex items-center gap-2">
        <FiUser className="w-6 h-6" />
        <span>User</span>
      </div>
      <FiSettings className="w-6 h-6" />
    </nav>
  );
};
