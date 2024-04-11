import { atom } from "jotai";
import { orderType } from "../../types/Order";

export const orderAtom = atom<orderType[] | null>(null)
