import { useEffect, createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState(null);

  const allUsers = async () => {
    try {
      let res = await fetch("http://localhost:3000/users");
      let data = await res.json();
      setUserData(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    allUsers();
  }, []);
  const addUser = (newUser) => {
    setUserData((prevUsers) => [...prevUsers, newUser]);
  };
  const loginUser = (email, password) => {
    let user = userData.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return false;
    }
    setUser(user);
    localStorage.setItem("userLoggedIn", JSON.stringify(user));
    return true;
  };
  return (
    <UserContext.Provider value={{ userData, loginUser, addUser, user }}>
      {children}
    </UserContext.Provider>
  );
};
