'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HTTP_URL } from '@/config';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${HTTP_URL}/api/v1/signin`, {
        email,
        password,
      });

      const token = response.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        alert('Login successful!');
        router.push('/canvas');
      } else {
        alert('Unexpected response from server.');
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          'User Not Found | Incorrect Password | Server Error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSignin}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
