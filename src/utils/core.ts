import { generateRandomHexString } from './crypto';
import { z } from 'zod';

export const UserProfileSchema = z.object({
  userToken: z.string().length(64, { message: '`userToken` must be of 256-bit length' }),
  savedChatRooms: z
    .array(
      z.object({
        name: z.string(),
        password: z.string(),
        username: z.string(),
      }),
    )
    .min(0),
});

export function getLocalUserProfile(): false | z.infer<typeof UserProfileSchema> {
  const userProfileStringFromLocal = localStorage.getItem('user_profile');

  const parsedUserProfile = JSON.parse(userProfileStringFromLocal ?? '{}');

  if (UserProfileSchema.safeParse(parsedUserProfile).success) return parsedUserProfile;

  return false;
}

export function initLocalUserProfile() {
  const freshUserProfile: z.infer<typeof UserProfileSchema> = {
    userToken: generateRandomHexString(64),
    savedChatRooms: [],
  };

  localStorage.setItem('user_profile', JSON.stringify(freshUserProfile));
  return freshUserProfile;
}

export function pushNewRoomtoLocalStore({
  chatRoomName,
  password,
  username,
}: {
  chatRoomName: string;
  password: string;
  username: string;
}) {
  const userProfileStringFromLocal = localStorage.getItem('user_profile');

  const parsedUserProfile: z.infer<typeof UserProfileSchema> = JSON.parse(userProfileStringFromLocal!);

  UserProfileSchema.parse(parsedUserProfile);

  parsedUserProfile.savedChatRooms.push({ name: chatRoomName, password, username });

  localStorage.setItem('user_profile', JSON.stringify(parsedUserProfile));

  return parsedUserProfile;
}
