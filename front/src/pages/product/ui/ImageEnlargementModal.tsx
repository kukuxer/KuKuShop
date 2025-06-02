import {useEffect} from "react";
import {IoMdClose} from "react-icons/io";

interface ImageEnlargementModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

const ImageEnlargementModal: React.FC<ImageEnlargementModalProps> = ({
                                                                         imageUrl,
                                                                         isOpen,
                                                                         onClose,
                                                                     }) => {
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [isOpen, onClose]);
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-label="Image modal"
        >
            <div
                className="relative max-w-[40vw] max-h-[150vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-1.5 bg-purple-600 rounded-lg">
                    <img
                        src={imageUrl}
                        alt="Enlarged product"
                        className="w-full h-auto rounded-lg"
                    />
                    <button
                        onClick={onClose}
                        className="absolute -top-3 -right-3 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors duration-300"
                        aria-label="Close modal"
                    >
                        <IoMdClose className="text-xl"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEnlargementModal;