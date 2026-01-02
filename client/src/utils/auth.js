export const getUserRole = (user) => {
  if (!user) return null;

  if (user.role === "employer") return "employer";
  return "jobseeker";
};
