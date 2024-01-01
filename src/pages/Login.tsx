import { Header, Login } from "../components";

export const LoginPage = () => {
  return (
    <div className="flex justify-center">
      <div className="mt-10">
        <Header
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/signup"
        />
        <Login />
      </div>
    </div>
  );
};
