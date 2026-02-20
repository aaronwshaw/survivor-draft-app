"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="secondary" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      Logout
    </button>
  );
}
