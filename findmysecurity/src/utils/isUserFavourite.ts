import axios from "axios";

interface TargetUser {
  id: number;
  firstName: string;
  lastName: string;
  screenName: string;
  profile: {
    image?: string;
  } | null;
}

interface FavoriteItem {
  id: number;
  requesterId: number;
  targetUserId: number;
  targetUser: TargetUser;
  createdAt: string;
}

export const isUserFavorite = async (targetUserId: number): Promise<boolean> => {
  const loginData = localStorage.getItem("loginData");
  const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");

  if (!loginData || !token) {
    localStorage.clear();
    window.location.href = "/signin";
    return false;
  }

  const userId = JSON.parse(loginData).id;

  try {
    const response = await axios.get<{ data: FavoriteItem[] }>(
      `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const favorites = response.data?.data || [];
    return favorites.some(item => item.targetUserId === targetUserId);
  } catch (error) {
    console.error("Error checking favorites:", error);
    return false;
  }
};
