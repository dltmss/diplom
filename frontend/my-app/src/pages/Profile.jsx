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
import { Mail, Phone, BadgeCheck, CalendarDays } from "lucide-react";

export default function Profile() {
  const [email, setEmail] = useState("aybek@example.com");
  const [phone, setPhone] = useState("+7 777 777 77 77");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Данные успешно обновлены!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">
        Профиль пользователя
      </h1>

      <Card className="overflow-hidden shadow-xl border-0 dark:bg-gray-800 transition-all duration-500">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 relative">
          <Avatar className="w-24 h-24 ring-4 ring-white dark:ring-gray-800 mb-4 hover:scale-110 transition-transform duration-300">
            <AvatarImage
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-semibold">
            Айбек Муратұлы
          </CardTitle>
          <p className="text-blue-100">Администратор системы</p>
          <div className="absolute top-4 right-4 text-sm bg-green-500 text-white px-3 py-1 rounded-full animate-pulse">
            Онлайн
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          {/* Контактная информация */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Контактная информация
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                {email}
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-green-500" />
                {phone}
              </div>
            </div>
          </section>

          {/* Статус */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Статус аккаунта
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <BadgeCheck className="w-5 h-5 mr-3 text-green-500" />
                Активен
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-3 text-purple-500" />
                Зарегистрирован: 12 января 2024
              </div>
            </div>
          </section>

          {/* Кнопка редактирования с модалкой */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full transition-all hover:scale-105">
                Редактировать профиль
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6">
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-800 dark:text-white">
                  Редактировать профиль
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full transition hover:scale-105"
                >
                  Сохранить изменения
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
