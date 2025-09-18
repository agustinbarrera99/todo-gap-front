import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import useDebounce from '../../hooks/useDebounce.jsx';

const API_USERS_URL = "http://localhost:8080/api/users";

// Recibe onMembersChange para comunicar los IDs al componente padre
const MemberSelector = ({ onMembersChange }) => { 
    const { authToken } = useAuth();
    const [searchTerm, setSearchTerm] = useState(''); 
    const [suggestions, setSuggestions] = useState([]); 
    const [selectedMembers, setSelectedMembers] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);

    // 💡 Implementar Debounce: el valor se actualiza 500ms después de que el usuario deja de escribir
    const debouncedSearchTerm = useDebounce(searchTerm, 400); 

    useEffect(() => {
        if (!authToken) return;

        const fetchUsers = async (query) => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const config = { 
                    headers: { 'Authorization': `Bearer ${authToken}` },
                    params: { username: query } // 💡 Usamos 'username' según tu backend
                };
                
                // Usamos el endpoint raíz con el filtro por query: /api/users?username=query
                const response = await axios.get(API_USERS_URL, config);
                
                // Muestra solo los usuarios que NO han sido seleccionados
                const newSuggestions = response.data.data.filter(user => 
                    !selectedMembers.some(member => member._id === user._id)
                );
                
                setSuggestions(newSuggestions);
            } catch (error) {
                console.error("Error buscando usuarios:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers(debouncedSearchTerm);
    }, [debouncedSearchTerm, authToken, selectedMembers]);

    const handleSelectMember = (user) => {
        const newMembers = [...selectedMembers, user];
        setSelectedMembers(newMembers);
        setSearchTerm('');
        setSuggestions([]);
        

        onMembersChange(newMembers.map(m => m._id));
    };
    
    const handleRemoveMember = (memberId) => {
        const newMembers = selectedMembers.filter(m => m._id !== memberId);
        setSelectedMembers(newMembers);
        
        onMembersChange(newMembers.map(m => m._id));
    };

    return (
        <div className="mb-4 relative">
            <label className="block mb-2 text-sm font-medium text-gray-900">
                Añadir Miembros (Opcional)
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2 min-h-[30px]">
                {selectedMembers.map(member => (
                    <span 
                        key={member._id} 
                        className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                        {member.username || member.email}
                        <button 
                            type="button" 
                            onClick={() => handleRemoveMember(member._id)}
                            className="ml-2 text-blue-600 hover:text-blue-900 font-bold"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>

            <input
                type="text"
                placeholder="Buscar por nombre de usuario o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
            />
            {isLoading && searchTerm.length >= 3 && <p className="text-sm text-gray-500 mt-1">Buscando...</p>}

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map(user => (
                        <li 
                            key={user._id}
                            className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleSelectMember(user)}
                        >
                            <span className="font-medium">{user.username}</span> 
                            <span className="text-gray-500"> ({user.email})</span>
                        </li>
                    ))}
                </ul>
            )}
            {/* Mensaje de no resultados */}
             {(debouncedSearchTerm.length >= 3 && !isLoading && suggestions.length === 0) && (
                <p className="text-sm text-gray-500 mt-2">No se encontraron usuarios.</p>
             )}
        </div>
    );
};

export default MemberSelector;