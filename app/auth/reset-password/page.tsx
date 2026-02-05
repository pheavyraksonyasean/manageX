import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/resetForm";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
