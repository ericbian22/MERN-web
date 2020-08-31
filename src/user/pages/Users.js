import React from "react";
import UsersList from "../components/UsersList";
const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Eric Bian",
      image: "https://miro.medium.com/proxy/1*2NsdF1pm1jR7FWmJqOIbWA.jpeg",
      places: 3
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
