'use client';
import React, { useState, useContext, createContext } from 'react';
import { UserProfileSchema } from '../utils/core';
import { z } from 'zod';

type UserProfile = z.infer<typeof UserProfileSchema>;

type UserProfileUseStateCoupleType = [UserProfile | null, React.Dispatch<React.SetStateAction<UserProfile | null>>];

const UserContext = createContext<UserProfileUseStateCoupleType>([null, () => {}]);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const userProfileUseStateCouple = useState<UserProfile | null>(
    JSON.parse(localStorage.getItem('user_profile') ?? 'null'),
  );

  return <UserContext.Provider value={userProfileUseStateCouple}>{children}</UserContext.Provider>;
}

export const useUserProfileContext = () => useContext(UserContext);