
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

const Index = () => {
  return (
    <AuthLayout
      title="Sign In to BLANK"
      description="Enter your email and password to access your POS system"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Index;
