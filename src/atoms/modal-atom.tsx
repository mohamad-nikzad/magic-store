import { atom } from "jotai";

type MODAL_VIEWS =
  | "REGISTER"
  | "LOGIN_VIEW"
  | "FORGOT_VIEW"
  | "OTP_LOGIN"
  | "ADD_OR_UPDATE_ADDRESS"
  | "ADD_OR_UPDATE_CHECKOUT_CONTACT"
  | "ADD_OR_UPDATE_PROFILE_CONTACT"
  | "DELETE_ADDRESS"
  | "PRODUCT_DETAILS"
  | "SHOP_INFO";

type State = {
  view?: MODAL_VIEWS;
  data?: any;
  isOpen: boolean;
};

export const modalAtom = atom<State>({
  isOpen: false,
  view: undefined,
  data: null,
});

export const openModalAtom = atom(
  null,
  (_get, set, { view, data }: { view: MODAL_VIEWS; data?: any }) =>
    set(modalAtom, {
      isOpen: true,
      view: view,
      data: data,
    })
);

export const closeModalAtom = atom(null, (_get, set) =>
  set(modalAtom, {
    isOpen: false,
    view: undefined,
    data: null,
  })
);
