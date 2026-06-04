import ForgotPassword from "@/features/auth/components/ForgotPassword";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Forgot Password'
}

const ForgotPasswordPage = () => {
  return (
    <>
      <Breadcrumb pageName="Forgot Password Page" />

      <Suspense fallback={null}>
        <ForgotPassword />
      </Suspense>
    </>
  );
};

export default ForgotPasswordPage;
