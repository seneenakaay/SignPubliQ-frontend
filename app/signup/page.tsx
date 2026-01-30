import Signup from './SignupForm';
import AuthRedirect from '../components/AuthRedirect';

export const metadata = {
  title: 'Sign Up - SignPuliQ',
  description: 'Create your free eSignHub account',
};

export default function SignupPage() {
  return (
    <>
      <AuthRedirect />
      <Signup />
    </>
  );
}
