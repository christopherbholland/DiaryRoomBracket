// Message utilities
export const showMessage = (message, type = 'success') => {
    const messageDiv = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    messageDiv.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg fade-in`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
};

export const showSuccessMessage = (message) => showMessage(message, 'success');
export const showErrorMessage = (message) => showMessage(message, 'error');

// Form utilities
export const collectFormData = (form) => {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        if (key.includes('[]')) {
            const cleanKey = key.replace('[]', '');
            if (!data[cleanKey]) data[cleanKey] = [];
            data[cleanKey].push(value);
        } else {
            data[key] = value;
        }
    }
    return data;
};