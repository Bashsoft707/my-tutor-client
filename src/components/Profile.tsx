import axios from "axios";
import React, { useState, useEffect } from "react";

export const UserProfile = ({ isOpen, onClose }: any) => {
  const user = JSON.parse(localStorage.getItem("user") as string);

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
        <div className="inline-block align-bottom bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Settings
                </h3>
                <div className="mt-5 flex gap-8">
                  <div className="p-4 overflow-auto w-full border border-[#DEE5E9] rounded-lg">
                    <h2 className="text-white text-[20px] leading-10 font-semibold">
                      Profile
                    </h2>
                    <div className="py-2 grid grid-cols-2 text-[#515151] leading-8 border-b-[0.3px] border-ash2 ">
                      <span className="text-[14px]">Knowledge Level:</span>
                      <span className="text-[14px] font-semibold">
                        {user.profile.knowledgeLevel}
                      </span>
                    </div>
                    <div className=" py-2 grid grid-cols-2 text-[#515151] border-b-[0.3px] border-ash2 ">
                      <span className="text-[14px]">Progress:</span>
                      <span className="text-[14px] font-semibold">
                        {user.profile.progress}
                      </span>
                    </div>
                    <div className="py-2 grid grid-cols-2 text-[#515151] border-b-[0.3px] border-ash2 ">
                      <span className="text-[14px]">Interests:</span>
                      <span className="text-[14px] font-semibold">
                        {user.profile.interests}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              // onClick={handleSaveProfile}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
