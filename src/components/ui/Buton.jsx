const Button = ({text, onClick, type = "button"}) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className="w-2xs text-black bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
        >
            {text}
        </button>
    )
}

export default Button