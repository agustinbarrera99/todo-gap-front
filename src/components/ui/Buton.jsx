const Button = ({text, onClick, bgColor, bgColorHover, textColor,type = "button"}) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className={`w-3x focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 ${bgColor} ${bgColorHover} ${textColor}`}
        >
            {text}
        </button>
    )
}

export default Button;
