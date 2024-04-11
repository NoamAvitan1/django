import { atom } from "jotai";
import { customerType } from "../../types/Customer";

export const customerAtom = atom<customerType[] | null>(null)
