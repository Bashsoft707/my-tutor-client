import { Header, SignUp } from "../components";

export const SignupPage = () => {
  return (
    <>
      <Header
        heading="Signup to create an account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/"
      />
      <SignUp />
    </>
  );
}
