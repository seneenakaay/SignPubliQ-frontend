import LoginForm from './LoginForm';
import AuthRedirect from "@/components/auth/AuthRedirect";

export const metadata = {
  title: 'Login - eSignHub',
  description: 'Sign in to your eSignHub account',
};

export default function LoginPage() {
  return (
    <>
      <AuthRedirect />
      <LoginForm />
    </>
  );
}
