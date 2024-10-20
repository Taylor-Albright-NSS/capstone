import './EditItemModal.css'; // Optional: CSS for styling the modal
import { ImageSelector } from '../common/ImageSelector';
export const EditItemModal = ({ onClose, itemData, setItemData }) => {
  return (
    <div className="edit-item-modal-overlay" onClick={onClose}>
      <div className="edit-item-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="edit-item-close-button" onClick={onClose}>&times;</span>
        <ImageSelector itemData={itemData} setItemData={setItemData} />
      </div>
    </div>
  );
}