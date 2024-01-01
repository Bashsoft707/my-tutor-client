import { Header, SignUp } from "../components";

export const SignupPage = () => {
  return (
    <div className="flex justify-center">
      <div className="mt-10">
        <Header
          heading="Signup to create an account"
          paragraph="Already have an account? "
          linkName="Login"
          linkUrl="/login"
        />
        <SignUp />
      </div>
    </div>
  );
};
