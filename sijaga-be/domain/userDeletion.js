const assertDeletableUser = (user, lockerStatus) => {
  if (!user) throw Object.assign(new Error("Pengguna tidak ditemukan."), { statusCode: 404 });
  if (user.role !== "USER") throw Object.assign(new Error("Akun admin tidak dapat dihapus."), { statusCode: 403 });
  if (lockerStatus === `LOCKED_${user.card_id}`) throw Object.assign(new Error("Pengguna masih memakai loker. Selesaikan pemakaian sebelum menghapus akun."), { statusCode: 409 });
};
module.exports = { assertDeletableUser };
