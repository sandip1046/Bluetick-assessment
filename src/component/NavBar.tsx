import { FaChevronDown } from "react-icons/fa"



const NavBar = () => {
    return (
        <div className={"flex justify-between items-center w-12/12 h-28 px-3 bg-gray-100 border border-b-gray-300"}>
            <h1 className={"text-center font-extrabold text-5xl text-black"}>User Data</h1>
            <div className={"flex justify-between items-center gap-2"}>
                <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="User Profile"
                    className="w-11 h-11 rounded-full"
                />
                <div className="flex justify-center items-center gap-2 text-black text-xl">
                    <h4 className={"font-bold"}>Sandip Kumar Yadav</h4>
                    <FaChevronDown className={"text-2xl"} />
                </div>
            </div>
        </div>
    )
}

export default NavBar