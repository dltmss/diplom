// src/pages/Users.jsx
import React, { useState, useEffect, useMemo } from "react";
import API from "../api/axios.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Button } from "../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Фильтры
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // по-умолчанию «all»

  // Модалка редактирования
  const [editUser, setEditUser] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Загружаем всех пользователей (суперадмин)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/users");
        setUsers(data);
      } catch (err) {
        toast.error("Не удалось загрузить пользователей");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Отфильтрованный список
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const term = search.trim().toLowerCase();
      if (
        term &&
        !(
          u.fullname.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
        )
      ) {
        return false;
      }
      if (roleFilter !== "all" && u.role !== roleFilter) {
        return false;
      }
      return true;
    });
  }, [users, search, roleFilter]);

  // Открыть форму редактирования
  const onEdit = (u) => {
    setEditUser({ ...u });
    setDialogOpen(true);
  };

  // Сохранить изменения
  const saveChanges = async () => {
    try {
      const payload = {
        role: editUser.role,
        position: editUser.position,
      };
      const { data } = await API.put(`/users/${editUser.id}`, payload);
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      toast.success("Пользователь обновлён");
      setDialogOpen(false);
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  // Удалить пользователя
  const onDelete = async (id) => {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Пользователь удалён");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Фильтры */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="По ФИО или email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="По роли" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Таблица */}
      <div className="overflow-auto border rounded">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Загрузка…</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Нет пользователей</TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell>
                    <img
                      src={
                        u.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          u.fullname
                        )}`
                      }
                      alt={u.fullname}
                      className="w-8 h-8 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{u.fullname}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.position || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(u)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(u.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Модалка редактирования */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Роль</label>
                <Select
                  value={editUser.role}
                  onValueChange={(v) => setEditUser((u) => ({ ...u, role: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Должность</label>
                <Input
                  value={editUser.position || ""}
                  onChange={(e) =>
                    setEditUser((u) => ({ ...u, position: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button onClick={saveChanges}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
