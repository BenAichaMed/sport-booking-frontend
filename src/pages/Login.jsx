import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, Github } from 'lucide-react';


const Login = () => {
  const [form, setForm] = useState({email: "", password: "" });
  console.log(form)
  const navigate = useNavigate();

  const onSwitch = () => {
    navigate("/register");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1567220720374-a67f33b2a6b9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVubmlzJTIwY291cnR8ZW58MHx8MHx8fDA%3D')] bg-cover bg-center relative ">
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
  <div className="relative min-h-screen flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl p-12 px-24 transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
        <p className="text-gray-600">Please sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-20">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>


        <button
          type="submit"
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Sign in
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Github className="mr-2 h-5 w-5" />
          Continue with GitHub
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors"
        >
          Sign up
        </button>
      </p>
    </div>
    </div>
    </div>
  );
};

export default Login;
