

    // Email validation function
export const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


export const isValidUsername = (username: string): boolean => {
    return (
        !username.includes(' ') && 
        !username.includes('\'') && 
        !username.includes('/') && 
        !username.includes('\\') && 
        username.length >= 8 && 
        username.length <= 50
    );
}