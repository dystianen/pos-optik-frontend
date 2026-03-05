import Signin from "@/features/auth/components/SignIn";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign In | Property",
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />

      <Signin />
    </>
  );
};

export default SigninPage;
