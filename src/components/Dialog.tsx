/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  children?: ReactNode;
  containerClassName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  fitHeight?: boolean;
}

const Modal: ForwardRefRenderFunction<refProps, props> = (
  { children, containerClassName, isOpen, title, fitHeight, onClose }: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(forwardedRef, () => ({
    open() {
      setVisible(true);
    },
    close() {
      setVisible(false);
    },
  }));

  const closeModal = () => {
    if (visible) setVisible(false);
    if (onClose) onClose();
  };

  return (
    <Transition as={Fragment} show={visible} appear>
      <Dialog
        open={visible || isOpen}
        onClose={closeModal}
        className="fixed inset-0 z-40 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <Transition.Child
            as="div"
            className="z-50"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={clsx(
                "h-screen w-screen overflow-y-auto rounded-lg bg-body px-4 md:max-h-[90vh] md:max-w-lg",
                containerClassName
              )}
            >
              {title && (
                <Dialog.Title>
                  <div className="shadow-bottom fixed top-0 left-0 right-0 flex h-14 items-center justify-between border-b bg-body px-4 md:static md:px-0 md:shadow-none">
                    <strong className=" py-3 text-right text-xl font-bold">
                      {title}
                    </strong>
                    {/* <Close size={26} role="button" onClick={closeModal} /> */}
                  </div>
                </Dialog.Title>
              )}
              <div className="md:mt-0">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default forwardRef(Modal);
