export function useHomePage() {
    const renderHtmlContent = (item: any, type: string): string => {
        if (item.name === type) {
            return item.html;
        }
        return '';
    };

    return {
        renderHtmlContent,
    };
}
