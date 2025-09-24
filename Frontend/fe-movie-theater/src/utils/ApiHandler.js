import { toast } from 'react-toastify';

export const handleApiRequest = async ({
    apiCall,
    onSuccess = () => { },
    successMessage = "Action completed successfully!",
    showSuccessToast = true
}) => {
    try {
        const response = await apiCall();
        onSuccess(response);

        if (showSuccessToast) {
            toast.success(successMessage);
        }

        return response;
    } catch (error) {
        throw error;
    }
};
