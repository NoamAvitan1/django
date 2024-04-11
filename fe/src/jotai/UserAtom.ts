import { atom } from "jotai";
import { userType } from "../../types/User";

export const userAtom = atom<userType | null>(null)
