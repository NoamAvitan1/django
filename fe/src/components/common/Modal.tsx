import '../../App.css'
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Function;
  onOpen?: Function;
  onClose?: Function;
};

export const Modal = (props: Props) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null)

  const closeModal = () => {
    if (props.onClose) props.onClose();
    setIsClosing(true);
    setTimeout(() => {
      props.setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (props.onOpen) props.onOpen();
  }, []);

  useEffect(() => {
    if (!modalRef.current) return
    const closeButton = modalRef.current.querySelector("#close-button") as HTMLButtonElement
    if (!closeButton) return
    closeButton.onclick = closeModal
  }, [props.children])

  return (
    props.isOpen && (
      <div
      ref={modalRef}
        onClick={closeModal}
        className={`${
          isClosing && "modal-container-vanish backdrop-blur-none"
        } fixed inset-0 z-40 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}
      >
        <article
          onClick={(e) => e.stopPropagation()}
          className={`${
            isClosing ? "modal-shrink" : "modal-grow"
          } flex max-h-[90%] max-w-[95%] justify-center`}
        >
          {props.children}
        </article>
      </div>
    )
  );
};
