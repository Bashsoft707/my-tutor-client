import axios from "axios";
import React, { useState } from "react";
import { baseUrl } from "../../constants/baseUrl";
import { MultiSelectDropdown } from "../MultiSelectDropDown";
import { ToastContainer, toast } from "react-toastify";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [interests, setInterests] = useState<string[]>([]);
  const [knowledgeLevel, setKnowledgeLevel] = useState<string>("");
  const token = localStorage.getItem("token");

  const handleSaveProfile = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/profile`,
        {
          interests,
          knowledgeLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
        toast.success(response.data.message);
        onClose();

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error in creating profile");
    }
  };

  const toggleOption = ({ title }: { title: string }) => {
    setInterests((prevSelected) => {
      // if it's in, remove
      const newArray: any = [...prevSelected];
      if (newArray.includes(title)) {
        return newArray.filter((item: any) => item !== title);
        // else, add
      } else {
        newArray.push(title);
        return newArray;
      }
    });
  };

  const data = [
    { id: 1, title: "Science" },
    { id: 2, title: "Humanities" },
  ];

  return (
    <>
      <ToastContainer />
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
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Create Your Profile
                  </h3>
                  <div className="mt-5 flex gap-8">
                    <div className="mb-4">
                      <label
                        htmlFor="interests"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Interests
                      </label>
                      <MultiSelectDropdown
                        options={data}
                        selected={interests}
                        toggleOption={toggleOption}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="learningPaths"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Knowledge Level
                      </label>
                      <select
                        id="knowledgeLevel"
                        name="knowledgeLevel"
                        value={knowledgeLevel}
                        onChange={(e) => setKnowledgeLevel(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-[#2B2C2F] border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};
