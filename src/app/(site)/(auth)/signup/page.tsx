import SignUp from "@/components/Auth/SignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign Up | Property",
};

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign Up Page" />

         // TODO - fix this if needed
      <SignUp setIsSignInOpen={function(open: boolean): void {
              throw new Error("Function not implemented.");
          } } setIsSignUpOpen={function(open: boolean): void {
              throw new Error("Function not implemented.");
          } } />
    </>
  );
};

export default SignupPage;
