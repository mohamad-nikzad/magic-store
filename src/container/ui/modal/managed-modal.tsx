import { closeModalAtom, modalAtom } from "@/atoms/modal-atom";
import Skeleton from "@/components/loading/Skeleton";
import Modal from "@/components/modal/Modal";
import { useAtom } from "jotai";

const ProductDetail = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 hidden-scrollbar overflow-y-auto">
      <div className="col-span-full py-4 border-b border-zinc-400">
        <Skeleton height={50} />
      </div>
      <div className="grid gap-3 grid-cols-3">
        <Skeleton height={400} className="col-span-full" />
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </div>
      <div className="flex flex-col justify-between">
        <Skeleton count={5} height={15} />
        <Skeleton height={45} className="mt-4" />
      </div>
    </div>
  );
};

const ManagedModal = () => {
  const [modalState] = useAtom(modalAtom);
  const [, closeModal] = useAtom(closeModalAtom);

  const modalView = () => {
    switch (modalState.view) {
      case "PRODUCT_DETAILS":
        return (
          <div className="bg-base-100 p-4 flex flex-col md:max-h-[90vh] w-screen h-screen  md:max-w-[95%] md:mx-auto md:rounded-xl lg:mx-w-4xl  xl:max-w-6xl">
            <ProductDetail />
          </div>
        );
      default:
        return <h1>default</h1>;
    }
  };
  return (
    <Modal isOpen={modalState.isOpen} closeModal={closeModal}>
      {modalView()}
    </Modal>
  );
};

export default ManagedModal;
