import { ForgetPassword, Header } from "../components";

export const ForgetPasswordPage = () => {
  return (
    <div className="flex justify-center">
      <div className="mt-10">
        <Header
          heading="Enter your email"
          paragraph="We will send you a link to your email to reset your password"
          linkName=""
          linkUrl="/forget-password"
        />
        <ForgetPassword />
      </div>
    </div>
  );
};
