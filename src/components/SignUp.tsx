import { useState } from "react";
import { signupFields } from "../constants/formFields";
import { FormAction } from "./FormAction";
import { Input } from "./Input";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl";

const fields = signupFields;
let fieldsState: any = {};

fields.forEach((field: any) => (fieldsState[field.id] = ""));

export const SignUp = () => {
  const [signupState, setSignupState] = useState(fieldsState);

  const handleChange = (e: { target: { id: any; value: any } }) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { confirmPassword, email, password, username } = signupState;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in required data");
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
    }

    const response = await axios.post(`${baseUrl}/register`, {
      username,
      email,
      password,
    });

    console.log("data", response.data, response);
    const data = response.data;
    return data;
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
};
