import { useState } from "react";
import { loginFields } from "../constants/formFields";
import { FormAction } from "./FormAction";
import { FormExtra } from "./FormExtra";
import { Input } from "./Input";
import { baseUrl } from "../constants/baseUrl";
import axios from "axios";

const fields = loginFields;
let fieldsState: any = {};
fields.forEach((field: any) => (fieldsState[field.id] = ""));

export const Login = () => {
  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { email, password } = loginState;

    if (!email || !password) {
      alert("Please fill in required data");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Save token and user details to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/main-page";
    } catch (error) {
      console.error("Login error:", error);

      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
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
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
};
