import Signin from "@/features/auth/components/SignIn";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Sign In'
}

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />

      <Suspense fallback={null}>
        <Signin />
      </Suspense>
    </>
  );
};

export default SigninPage;
