import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Přihlášení",
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />

        // TODO - fix this if needed
      <Signin setIsSignInOpen={function(open: boolean): void {
              throw new Error("Function not implemented.");
          } } setIsSignUpOpen={function(open: boolean): void {
              throw new Error("Function not implemented.");
          } } />
    </>
  );
};

export default SigninPage;
