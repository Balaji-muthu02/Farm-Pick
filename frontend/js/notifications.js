/**
 * Utility to show custom DOM notifications instead of browser alerts.
 */

// Inject styles into the head
const style = document.createElement('style');
style.textContent = `
    .toast-container {
        position: fixed;
        top: 30px;
        right: 30px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        perspective: 1000px;
    }

    .toast {
        padding: 14px 22px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        min-width: 280px;
        max-width: 420px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        backdrop-filter: blur(8px);
        white-space: pre-wrap;
    }

    .toast:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 30px rgba(0,0,0,0.15);
    }

    .toast::before {
        content: '';
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
    }

    .toast.success {
        background: linear-gradient(135deg, #10b981, #059669);
        border-left: 6px solid #047857;
    }

    .toast.success::before {
        content: '✓';
    }

    .toast.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-left: 6px solid #b91c1c;
    }

    .toast.error::before {
        content: '!';
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%) rotateY(-20deg);
        }
        to {
            opacity: 1;
            transform: translateX(0) rotateY(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
        }
    }
`;
document.head.appendChild(style);

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error'.
 */
export function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, 5000);

    // Click to remove
    toast.onclick = () => {
        clearTimeout(timeout);
        removeToast(toast);
    };
}

function removeToast(toast) {
    toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
    toast.addEventListener('animationend', () => {
        toast.remove();
        const container = document.querySelector('.toast-container');
        if (container && container.children.length === 0) {
            container.remove();
        }
    });
}

// Global exposure for non-module scripts if needed
window.showAlert = showToast;
