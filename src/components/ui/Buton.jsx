const Button = ({text, onClick, type = "button"}) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
            {text}
        </button>
    )
}

export default Button