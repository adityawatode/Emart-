(() => {
    const storageKey = 'emart-cart';

    const getItems = () => {
        const storedItems = localStorage.getItem(storageKey);
        if (storedItems === null) return [];

        const items = JSON.parse(storedItems);
        if (!Array.isArray(items)) {
            throw new Error('Saved cart data is invalid.');
        }

        return items;
    };

    const saveItems = (items) => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    };

    window.emartCart = { getItems, saveItems };
})();
