import SignUp from "@/features/auth/components/SignUp";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Sign Up'
}

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign Up Page" />

      <Suspense fallback={null}>
        <SignUp />
      </Suspense>
    </>
  );
};

export default SignupPage;
