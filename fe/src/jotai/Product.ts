import { atom } from "jotai";
import { productType } from "../../types/Product";

export const productAtom = atom<productType[] | null>(null)
