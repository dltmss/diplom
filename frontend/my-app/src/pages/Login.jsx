// src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Барлық өрістерді толтырыңыз");
      return;
    }

    if (password.length < 6) {
      toast.error("Құпия сөз кем дегенде 6 таңбадан тұруы керек");
      return;
    }

    setLoading(true);
    toast.success("Сәтті кіру!");

    setTimeout(() => {
      console.log("Email:", email);
      console.log("Құпия сөз:", password);
      setLoading(false);
      navigate("/dashboard"); // ✅ Здесь исправлено на /dashboard
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 animate-fade-in"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          Қош келдіңіз!
        </h2>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <Input
            type="password"
            placeholder="Құпия сөз"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Кіру"}
        </Button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Аккаунтыңыз жоқ па?{" "}
          <Link
            to="/register"
            className="text-blue-300 hover:text-blue-500 transition"
          >
            Тіркелу
          </Link>
        </p>
      </form>
    </div>
  );
}
