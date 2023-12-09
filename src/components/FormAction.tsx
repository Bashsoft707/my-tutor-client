import React from "react";

export enum FormType {
  submit,
  reset,
  Button,
}

export const FormAction = ({
  handleSubmit,
  type = FormType.Button,
  action = "submit",
  text,
}: any) => {
  return (
    <>
      {type === FormType.Button ? (
        <button
          type={action}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
          onClick={handleSubmit}
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};
