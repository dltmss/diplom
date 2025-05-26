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

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [editUser, setEditUser] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // ✅ Загружаем всех пользователей
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/users/all");
        setUsers(data);
      } catch (err) {
        toast.error("Не удалось загрузить пользователей");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  const onEdit = (u) => {
    setEditUser({ ...u });
    setDialogOpen(true);
  };

  // ✅ Сохраняем изменения в роли и должности
  const saveChanges = async () => {
    try {
      const payload = {
        role: editUser.role,
        position: editUser.position,
      };
      const { data } = await API.patch(
        `/users/${editUser.id}/update-role`,
        payload
      );
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      toast.success("Пайдаланушы жаңартылды");
      setDialogOpen(false);
    } catch {
      toast.error("Сақтау кезінде қате шықты");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Пайдаланушыны жою керек пе?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Пайдаланушы жойылды");
    } catch {
      toast.error("Жою кезінде қате");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="ФИО немесе email арқылы іздеу…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Рөлі бойынша" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Барлығы</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-auto border rounded">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Рөлі</TableHead>
              <TableHead>Лауазымы</TableHead>
              <TableHead className="text-right">Әрекеттер</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Жүктелуде…</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Пайдаланушылар табылмады</TableCell>
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

                    {user.id !== u.id && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(u.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Пайдаланушыны өзгерту</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Рөлі</label>
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
                <label className="block mb-1">Лауазымы</label>
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
              <Button variant="outline">Бас тарту</Button>
            </DialogClose>
            <Button onClick={saveChanges}>Сақтау</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
