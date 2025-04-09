import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <User className="w-16 h-16 text-gray-500 mb-4" />
          <CardTitle className="text-xl">Айбек Муратұлы</CardTitle>
          <p className="text-gray-500">Әкімші</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email:</p>
            <p className="font-medium">aybek@example.com</p>
          </div>
          <Button className="w-full">Редактировать профиль</Button>
        </CardContent>
      </Card>
    </div>
  );
}
