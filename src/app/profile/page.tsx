"use client";

import React from "react";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Načítání...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Přístup odepřen. Nejste přihlášeni.</p>;
  }

  const user = session?.user;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil uživatele</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Jméno:</h2>
          <p className="text-gray-600">{user?.firstName} {user?.lastName}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">E-mail:</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Role:</h2>
          <p className="text-gray-600 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;