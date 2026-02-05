"use client";

import { useState, useEffect } from "react";
import { UserManagementHeader } from ".././user-manage/user-management-header";
import { UserStats } from ".././user-manage/user-stats";
import { UserList } from "./user-list";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  tasksCount: number;
}

export function UserManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [regularUsers, setRegularUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setRegularUsers(data.regularUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <>
        <UserManagementHeader />
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading users...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserManagementHeader />
      <UserStats totalUsers={totalUsers} regularUsers={regularUsers} />
      <UserList users={users} />
    </>
  );
}
