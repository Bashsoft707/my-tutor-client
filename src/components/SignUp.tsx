import { useState } from "react";
import { signupFields } from "../constants/formFields";
import { FormAction } from "./FormAction";
import { Input } from "./Input";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fields = signupFields;
let fieldsState: any = {};

fields.forEach((field: any) => (fieldsState[field.id] = ""));

export const SignUp = () => {
  const [signupState, setSignupState] = useState(fieldsState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { id: any; value: any } }) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);

      const { confirmPassword, email, password, username } = signupState;

      if (!username || !email || !password || !confirmPassword) {
        toast.error("Please fill in required data");
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      }

      const response = await axios.post(`${baseUrl}/register`, {
        username,
        email,
        password,
      });

      console.log("data", response.data, response);

      if (response.data.success) {
        toast.success("Signup successful");
        setLoading(false);
        window.location.href = "/login";
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
          <FormAction
            handleSubmit={handleSubmit}
            text="Signup"
            loading={loading}
          />
        </div>
      </form>
    </>
  );
};
