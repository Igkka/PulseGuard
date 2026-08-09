import CryptoJS from "crypto-js";

export const DEFAULT_AVATAR = "/users/user24px.svg";

const USERS_KEY = process.env.KEY;
const STORAGE_SECRET = process.env.STORAGE_Password;

function encryptStorageValue(value) {
  return CryptoJS.AES.encrypt(JSON.stringify(value), STORAGE_SECRET).toString();
}

function decryptStorageValue(data) {
  if (!data) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(data, STORAGE_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;

    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

export function setStorageItem(key, value) {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, encryptStorageValue(value));
}

export function getStorageItem(key, fallback = null) {
  if (typeof window === "undefined") return fallback;

  const rawValue = localStorage.getItem(key);
  if (rawValue === null) return fallback;

  const decryptedValue = decryptStorageValue(rawValue);
  if (decryptedValue !== null) return decryptedValue;

  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
}

export function removeStorageItem(key) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function saveUsers(users) {
  setStorageItem(USERS_KEY, users);
}

function migrateLegacyUser() {
  const legacy = localStorage.getItem("user");
  if (!legacy) return;

  try {
    const oldUser = JSON.parse(legacy);
    const users = Array.isArray(getStorageItem(USERS_KEY, []))
      ? getStorageItem(USERS_KEY, [])
      : [];
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
  } catch {
    // Ignore invalid legacy data.
  }

  localStorage.removeItem("user");
}

export function getUsers() {
  if (typeof window === "undefined") return [];
  migrateLegacyUser();

  const data = getStorageItem(USERS_KEY, []);
  if (Array.isArray(data)) return data;

  return [];
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
  setStorageItem("isAuth", "true");
  setStorageItem("currentUser", user?.username || "");
  setStorageItem("currentAvatar", user?.avatar || DEFAULT_AVATAR);
  setStorageItem("plan", plan);
}

export function logout() {
  removeStorageItem("isAuth");
  removeStorageItem("currentUser");
  removeStorageItem("currentAvatar");
  removeStorageItem("plan");
}

export function getSession() {
  if (typeof window === "undefined") {
    return { isAuth: false, username: "", avatar: DEFAULT_AVATAR, plan: "" };
  }

  return {
    isAuth: getStorageItem("isAuth", false) === "true",
    username: getStorageItem("currentUser", "") || "",
    avatar: getStorageItem("currentAvatar", DEFAULT_AVATAR) || DEFAULT_AVATAR,
    plan: getStorageItem("plan", "") || "",
  };
}
