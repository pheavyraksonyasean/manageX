"use client";

import { useState } from "react";
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

// Mock data - replace with real data from your backend
const mockUsers: User[] = [
  {
    id: "1",
    name: "admin user",
    email: "admin24@gmail.com",
    role: "admin",
    tasksCount: 0,
  },
  {
    id: "2",
    name: "use",
    email: "bdmigergerru24@gmail.com",
    role: "user",
    tasksCount: 0,
  },
  {
    id: "3",
    name: "use",
    email: "bdmigergerru24@gmail.com",
    role: "user",
    tasksCount: 0,
  },
  {
    id: "4",
    name: "user",
    email: "test@gmail.com",
    role: "user",
    tasksCount: 0,
  },
];

export function UserManagementContent() {
  const [users] = useState<User[]>(mockUsers);

  const totalUsers = users.length;
  const regularUsers = users.filter((u) => u.role === "user").length;

  return (
    <>
      <UserManagementHeader />
      <UserStats totalUsers={totalUsers} regularUsers={regularUsers} />
      <UserList users={users} />
    </>
  );
}
