import Modal from "@/components/global/modal";
import SizeTable from "@/components/global/size-table";
import { ISizeTable } from "@/constants/type-table";

interface FormModalProps {
  isShowModal: boolean;
  isShowSize: boolean;
  modalContent: JSX.Element | null;
  sizeTable: ISizeTable | null;
  //   handleCloseModal: () => void;
  handleCloseSize: () => void;
}

export function FormModal({
  isShowModal,
  isShowSize,
  modalContent,
  sizeTable,
  //   handleCloseModal,
  handleCloseSize,
}: FormModalProps) {
  return (
    <>
      <Modal onClose={handleCloseSize}>{isShowModal && modalContent}</Modal>

      {sizeTable && isShowSize && (
        <Modal onClose={handleCloseSize}>
          <SizeTable
            tableHeader={sizeTable!.header}
            tableBody={sizeTable!.body}
          ></SizeTable>
        </Modal>
      )}
    </>
  );
}
