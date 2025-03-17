
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

const Register = () => {
  return (
    <AuthLayout
      title="Create an Account"
      description="Sign up to start using the BLANK POS system"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
