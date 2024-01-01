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

export const Login = () => {
  const [loginState, setLoginState] = useState(fieldsState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = loginState;

    if (!email || !password) {
      toast.error("Please fill in required data");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      const { token, user } = response.data.data;

      if (user && token) {
        // Save token and user details to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Signup successful");
        setLoading(false);

        window.location.href = "/";
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

        <FormExtra />
        <FormAction
          handleSubmit={handleSubmit}
          text="Login"
          loading={loading}
        />
      </form>{" "}
    </>
  );
};
