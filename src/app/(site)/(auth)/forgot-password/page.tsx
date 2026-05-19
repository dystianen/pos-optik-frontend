import ForgotPassword from "@/features/auth/components/ForgotPassword";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Forgot Password'
}

const ForgotPasswordPage = () => {
  return (
    <>
      <Breadcrumb pageName="Forgot Password Page" />

      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
