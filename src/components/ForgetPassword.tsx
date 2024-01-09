import { useState } from "react";
import { loginFields } from "../constants/formFields";
import { FormAction } from "./FormAction";
import { FormExtra } from "./FormExtra";
import { Input } from "./Input";
import { baseUrl } from "../constants/baseUrl";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fields = loginFields;
let fieldsState: any = {};
fields.forEach((field: any) => (fieldsState[field.id] = ""));

export const ForgetPassword = () => {
  const [loginState, setLoginState] = useState(fieldsState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { email } = loginState;

    if (!email) {
      toast.error("Please fill in required data");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/password/reset`, {
        email,
      });

      if (response.data.data) {
        toast.success("Email sent to user email");
        setLoading(false);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        setLoading(false);
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
          {fields.map(
            (field: {
              id: string | number;
              labelText: any;
              labelFor: any;
              name: any;
              type: any;
              isRequired: any;
              placeholder: any;
            }) => (
              <Input
                key={field.id}
                handleChange={handleChange}
                value={loginState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
              />
            )
          )}
        </div>
        <div className="flex items-center gap-5">
          <FormAction
            handleSubmit={handleSubmit}
            text="Reset Password"
            loading={loading}
          />
          <button
            className="text-purple-600 w-full flex justify-center py-2 px-4 border border-purple-600 text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/login";
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};
