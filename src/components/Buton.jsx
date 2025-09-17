const Buton = ({text, onClick}) => {
    return (
        <button onClick={onClick} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition duration-500 transition-discrete">
            {text}
        </button>
    )
}

export default Buton