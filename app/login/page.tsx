import AuthForm from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>
        <AuthForm type="login" />
      </div>
    </div>
  );
}