import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/verifyForm";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
};

export default page;
