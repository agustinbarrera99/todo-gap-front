const IconContainer = ({ icon, className = "" }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            {icon}
        </div>
    );
};

export default IconContainer;