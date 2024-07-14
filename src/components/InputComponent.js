import React from 'react';

export default function InputComponent({
    type = "text",
    name = "",
    title="",
    id = "",
    placeholder = "",
    setInputChange = () => {},
    value = "",
    required = false,
    error="",
    className = ""
}) {
    return (
        <div className={`w-full ${className}`}>
            {title && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {title}
                </label>
            )}
            <input 
                type={type} 
                name={name} 
                id={id} 
                placeholder={placeholder} 
                onChange={(e) => setInputChange(e)} 
                value={value}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={required} 
            />
            {
                error && <p className=' text-red-500 text-xs '>{error}</p>
            }
            
        </div>
    );
}
