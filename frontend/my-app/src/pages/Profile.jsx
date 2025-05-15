// src/pages/Profile.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Upload, CheckCircle2 } from "lucide-react";
export default function Profile() {
  const [email, setEmail] = useState("aybek@example.com");
  const [phone, setPhone] = useState("+7 777 777 77 77");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleSave = () => {
    setShowConfirm(false);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="flex justify-center items-start mt-4 lg:mt-6 px-4">
      <Card className="w-full max-w-4xl rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Верхняя часть */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white text-center rounded-t-2xl relative">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative group w-fit mx-auto cursor-pointer">
                <Avatar className="w-24 h-24 ring-4 ring-white transition-transform group-hover:scale-105">
                  <AvatarImage src={avatarUrl} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-white text-blue-600 p-1 rounded-full shadow-md group-hover:scale-110 transition">
                  <Upload className="w-4 h-4" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6">
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-800 dark:text-white">
                  Фотосуретті жүктеу
                </DialogTitle>
              </DialogHeader>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </DialogContent>
          </Dialog>

          <CardTitle className="text-2xl font-bold mt-3">
            Айбек Мұратұлы
          </CardTitle>
          <p className="text-blue-100 text-sm">Жүйе әкімшісі</p>
        </div>

        {/* Контент */}
        <CardContent className="px-6 py-6 md:px-10 md:py-6 bg-white dark:bg-gray-900 space-y-6">
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              Байланыс ақпараты
            </h2>
            <div className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                {email}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                {phone}
              </div>
            </div>
          </section>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Электрондық пошта
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                Телефон нөмірі
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 transition"
              >
                Өзгерістерді сақтау
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Уведомление */}
      {showMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Профиль деректері сәтті жаңартылды!</span>
        </div>
      )}

      {/* Модал подтверждения */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white">
              Өзгерістерді сақтау
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Сіз шынымен өзгерістерді сақтағыңыз келе ме?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="rounded-md"
            >
              Жоқ
            </Button>
            <Button
              variant="destructive"
              onClick={handleSave}
              className="rounded-md"
            >
              Иә
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
