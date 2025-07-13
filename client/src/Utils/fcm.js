import { messaging } from "../firebase"; // Sadece messaging'i import et

export async function getFcmToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await messaging.getToken({
        vapidKey:
          "BD76vScR-DuLGsxi9ARax2_hG0UWeZxPvkYFkKOpelkXa1pdgDjXvBmhAU_6zp9N0tVApHh1wKqFwa60tCBGJFc",
      }); // messaging üzerinden getToken çağır
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Bildirim izni reddedildi.");
      return null;
    }
  } catch (error) {
    console.error("Token alma hatası:", error);
    return null;
  }
}
