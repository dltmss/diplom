// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Loader2, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "../lib/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !position) {
      toast.error("Барлық өрістерді толтырыңыз");
      return;
    }

    if (password.length < 6) {
      toast.error("Құпия сөз кем дегенде 6 таңбадан тұруы керек");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullname: name,
        email,
        password,
        phone,
        position,
        avatar_url: null,
      });

      toast.success("Тіркелу сәтті аяқталды!");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Тіркелу кезінде қате пайда болды"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-600 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 animate-fade-in"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          Тіркелу
        </h2>

        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Аты-жөні"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="pl-10"
          />
        </div>

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

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        {/* Position */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Қызметі"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="pl-3"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 duration-300 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Тіркелу"}
        </Button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Аккаунтыңыз бар ма?{" "}
          <Link
            to="/login"
            className="text-purple-300 hover:text-purple-500 transition"
          >
            Кіру
          </Link>
        </p>
      </form>
    </div>
  );
}
