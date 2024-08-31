import SizeTable from "@/components/global/size-table";
import { ISizeTable } from "@/constants/type-table";
import CustomModal from "./custom-modal";

interface FormModalProps {
  isShowModal: boolean;
  isShowSize: boolean;
  modalContent: JSX.Element | null;
  sizeTable: ISizeTable | null;
  handleCloseModal: () => void;
  handleCloseSize: () => void;
}

export function FormModal({
  isShowModal,
  isShowSize,
  modalContent,
  sizeTable,
  handleCloseModal,
  handleCloseSize,
}: FormModalProps) {
  return (
    <>
      {isShowSize && (
        <CustomModal isOpen={isShowSize} onClose={handleCloseSize}>
          {sizeTable ? (
            <SizeTable
              tableHeader={sizeTable.header}
              tableBody={sizeTable.body}
            />
          ) : (
            <p>아직 해당 물품은 가이드표가 준비되어있지 않습니다.</p>
          )}
        </CustomModal>
      )}
    </>
  );
}
