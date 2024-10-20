import './ImageSelectModal.css'; // Optional: CSS for styling the modal
import { ImageSelector } from './ImageSelector';

export const ImageSelectModal = ({ onClose, itemData, setItemData }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <ImageSelector itemData={itemData} setItemData={setItemData} />
      </div>
    </div>
  );
}