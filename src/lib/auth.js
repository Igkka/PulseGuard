import CryptoJS from "crypto-js";

export const DEFAULT_AVATAR = "/users/user24px.svg";

const USERS_KEY = "users";
const USERS_SECRET = "CybersecurityAppUserSecret2026";

function encryptUsers(users) {
  return CryptoJS.AES.encrypt(JSON.stringify(users), USERS_SECRET).toString();
}

function decryptUsers(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, USERS_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch {
    return null;
  }
}

export function saveUsers(users) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, encryptUsers(users));
}

function migrateLegacyUser() {
  const legacy = localStorage.getItem("user");
  if (!legacy) return;

  try {
    const oldUser = JSON.parse(legacy);
    const users = getUsers();
    const exists = users.some(
      (u) => u.username === oldUser.username || u.email === oldUser.email
    );

    if (!exists && oldUser.username && oldUser.email) {
      users.push({
        username: oldUser.username,
        email: oldUser.email,
        password: oldUser.password,
        avatar: oldUser.avatar || DEFAULT_AVATAR,
        plan: oldUser.plan || "free",
      });
      saveUsers(users);
    }
  } catch {}

  localStorage.removeItem("user");
}

export function getUsers() {
  if (typeof window === "undefined") return [];
  migrateLegacyUser();

  const data = localStorage.getItem(USERS_KEY);
  if (!data) return [];

  const decrypted = decryptUsers(data);
  if (decrypted) return decrypted;

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function registerUser({ username, email, password, avatar }) {
  const users = getUsers();

  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: "This username is already taken" };
  }

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "This email is already registered" };
  }

  const user = {
    username,
    email,
    password,
    avatar: avatar || DEFAULT_AVATAR,
    plan: "free",
  };

  users.push(user);
  saveUsers(users);
  setSession(user);

  return { success: true, user };
}

export function loginUser({ username, email, password }) {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, error: "Incorrect username, email, or password" };
  }

  setSession(user);
  return { success: true, user };
}

export function setSession(user) {
  const plan = user?.plan || "free";
  localStorage.setItem("isAuth", "true");
  localStorage.setItem("currentUser", user?.username || "");
  localStorage.setItem("currentAvatar", user?.avatar || DEFAULT_AVATAR);
  localStorage.setItem("plan", plan);
}

export function logout() {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentAvatar");
  localStorage.removeItem("plan");
}

export function getSession() {
  if (typeof window === "undefined") {
    return { isAuth: false, username: "", avatar: DEFAULT_AVATAR, plan: "" };
  }

  return {
    isAuth: localStorage.getItem("isAuth") === "true",
    username: localStorage.getItem("currentUser") || "",
    avatar: localStorage.getItem("currentAvatar") || DEFAULT_AVATAR,
    plan: localStorage.getItem("plan") || "",
  };
}
