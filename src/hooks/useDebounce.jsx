import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
    // Estado para almacenar el valor con debounce
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

      
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); 

    return debouncedValue;
}