import { X } from 'lucide-react';
import { useAutoClose } from './UseAutoClose';

export function LogoutModal({ setShowLogoutModal, handleLogout }) {
    return (
        <main className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs flex items-center justify-center z-50">
            <section className="bg-gray-800 p-6 rounded-lg border border-purple-600 text-white max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                <p className="mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setShowLogoutModal(false)}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    >
                        Log out
                    </button>
                </div>
            </section>
        </main>
    );
}

export function ChatDeleteModal({ onConfirm, onCancel }) {
    return (
        <main className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs flex items-center justify-center z-50">
            <section className="bg-gray-800 p-6 rounded-lg border border-red-600 text-white max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Delete Chat</h2>
                <p className="mb-6">Are you sure you want to delete this chat?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </section>
        </main>
    );
}

export const DeleteModalSuccess = ({ onClose }) => {
    useAutoClose(onClose);
    return (
        <ModalContent icon="/images/check.png" text="Chat Deleted" onClose={onClose} />
    );
};

export const SignUpModalSuccess = ({ onClose }) => {
    useAutoClose(onClose);
    return (
        <ModalContent icon="/images/check.png" text="Sign Up Successful" onClose={onClose} />
    );
};

export const SignUpModalFailed = ({ onClose }) => {
    useAutoClose(onClose);
    return (
        <ModalContent icon="/images/cancel.png" text="Sign Up Failed" onClose={onClose} />
    );
};

export const LoginModalSuccess = ({ onClose }) => {
    useAutoClose(onClose);
    return (
        <ModalContent icon="/images/check.png" text="Login Successful" onClose={onClose} />
    );
};

export const LoginModalFailed = ({ onClose }) => {
    useAutoClose(onClose);
    return (
        <ModalContent icon="/images/cancel.png" text="Login Failed" onClose={onClose} />
    );
};

export const LogoutModalSuccess = ({ onClose }) => {
    useAutoClose(onClose);
    return (
        <ModalContent icon="/images/logout.png" text="Logged out" onClose={onClose} />
    );
};

const ModalContent = ({ icon, text, onClose }) => (
    <div className="absolute top-0">
        <main className="flex bg-white p-3 rounded-lg text-gray-700 max-w-sm h-20">
            <section className="flex items-center gap-2">
                <img src={icon} alt="Status" className="w-7 h-7" />
                <h2 className="text-sm font-bold">{text}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-400 rounded-full">
                    <X className="w-4 h-4" />
                </button>
            </section>
        </main>
    </div>
);
