import { SignIn } from "@clerk/nextjs";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-bg-base">
      <AuthLeftPanel />
      <div className="flex flex-1 items-center justify-center p-8">
        <SignIn />
      </div>
    </div>
  );
}
