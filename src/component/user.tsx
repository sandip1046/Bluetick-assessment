import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Placeholder } from 'rsuite';
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { FaChevronDown, FaSearch } from "react-icons/fa";

interface User {
    first_name: string;
    last_name: string;
    username: string;
    age: string;
    marital_status: string;
    is_employed: boolean;
    is_founder: boolean;
}

const User: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newUser, setNewUser] = useState<User>({
        first_name: '',
        last_name: '',
        username: '',
        age: '',
        marital_status: 'unmarried',
        is_employed: false,
        is_founder: false,
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [openForAdd, setOpenForAdd] = useState<boolean>(false);
    const [openForEdit, setOpenForEdit] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get<User[]>('https://mocki.io/v1/a6a0fb6b-a84a-4934-b3f2-5c92cc77c44e');
                setUsers(response.data);
                setFilteredUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch data');
                alert("Eroor during fetching data" + error)
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle input change for the add/edit form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: name === "age" ? (value === "" ? "" : parseInt(value, 10)) : value,
        }));
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Handle search functionality
    const handleSearch = () => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const results = users.filter(user =>
            user.first_name.toLowerCase().includes(lowerCaseQuery) ||
            user.last_name.toLowerCase().includes(lowerCaseQuery) ||
            user.username.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredUsers(results);
    };
    // Handle Add User
    const handleAddUser = () => {
        if (editingIndex === null) {
            setUsers((prevUsers) => [...prevUsers, newUser]);
            setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
        } else {
            const updatedUsers = users.map((user, index) => (index === editingIndex ? newUser : user));
            setUsers(updatedUsers);

            setFilteredUsers(updatedUsers);
            setEditingIndex(null);
        }
        // Clear form after adding/editing
        setNewUser({
            first_name: '',
            last_name: '',
            username: '',
            age: '',
            marital_status: 'unmarried',
            is_employed: false,
            is_founder: false,
        });
        setOpenForEdit(false);
    };

    // Handle Edit User
    const handleEditUser = (index: number) => {
        setOpenForEdit(true);
        setNewUser(filteredUsers[index]);
        setEditingIndex(index);
    };

    // Handle Delete User
    const handleDeleteUser = (index: number) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setFilteredUsers(updatedUsers);
        setUsers(updatedUsers);
    };

    return (
        <>
            <div style={{ padding: '32px' }}>
                <div>
                    <h1 className={"text-center font-extrabold text-5xl text-black"}>User Data</h1>
                    <div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 mb-5 mt-4">
                            <div className="flex justify-between items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    className="p-1 pl-3 border border-gray-800 rounded"
                                />
                                <FaSearch onClick={handleSearch} className="w-7 h-7 cursor-pointer" />
                            </div>
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
                        <button onClick={() => setOpenForAdd(!openForAdd)} className={"flex justify-between items-center gap-3 bg-blue-200 hover:bg-blue-300 text-black text-xl font-semibold p-3 border border-gray-900 rounded-full cursor-pointer "}><IoMdPersonAdd width={50} height={50} /><span>Add User</span></button>

                    </div>
                </div>

                {openForAdd && (
                    <div className={"flex flex-col justify-center items-center gap-3  border border-gray-600 rounded shadow-lg my-5 w-10/12 md:w-3/12 "}>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="first_name"
                            value={newUser.first_name}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-3 w-9/12"}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="last_name"
                            value={newUser.last_name}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-2 w-9/12"}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-2 w-9/12"}
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            name="age"
                            value={newUser.age}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-2 w-9/12"}
                        />
                        <select
                            name="marital_status"
                            value={newUser.marital_status}
                            onChange={handleSelectChange}
                            className="border border-gray-500 rounded p-2 mb-2 mt-2 w-9/12"
                        >
                            <option value="unmarried">Unmarried</option>
                            <option value="married">Married</option>
                        </select>

                        <button onClick={handleAddUser} className={"flex justify-between items-center gap-3 bg-blue-200 hover:bg-blue-300 text-black text-xl font-semibold p-3 border border-gray-900 rounded-full cursor-pointer  mb-2"}>Add User</button></div>

                )}
                {openForEdit && (
                    <div className={"flex flex-col justify-center items-center gap-3  border border-gray-600 rounded shadow-lg my-5 w-10/12 md:w-3/12 "}> <input
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={newUser.first_name}
                        onChange={handleInputChange}
                        required
                        className={"border border-gray-500 rounded p-2 mb-2 mt-3 w-9/12"}
                    />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="last_name"
                            value={newUser.last_name}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-3 w-9/12"}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-3 w-9/12"}
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            name="age"
                            value={newUser.age}
                            onChange={handleInputChange}
                            required
                            className={"border border-gray-500 rounded p-2 mb-2 mt-3 w-9/12"}
                        />
                        <select
                            name="marital_status"
                            value={newUser.marital_status}
                            onChange={handleSelectChange}
                            className="border border-gray-500 rounded p-2 mb-2 mt-2 w-9/12"
                        >
                            <option value="unmarried">Unmarried</option>
                            <option value="married">Married</option>
                        </select>
                        <button onClick={handleAddUser} className={"flex justify-between items-center gap-3 bg-blue-200 hover:bg-blue-300 text-black text-xl font-semibold p-3 border border-gray-900 rounded-full cursor-pointer  mb-2"}>Update User</button>
                    </div>

                )}
                {loading &&
                    <div><Placeholder.Paragraph rows={8} />
                        <Loader backdrop content="loading..." vertical />
                    </div>}

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {!loading && !error && filteredUsers.map((users, index) => (
                        // <UserCard key={index} users={users} setUsers={setUsers} />
                        <div className={"border border-gray-800 rounded m-5 bg-gray-100 text-gray-950 p-5 shadow-lg"}>
                            <h2 className={"text-lg"}>{users.first_name} {users.last_name}</h2>
                            <p className={"text-lg"}><span className={"font-bold "}>Username:</span> {users.username}</p>
                            <p className={"text-lg"}><span className={"font-bold "}>Age:</span> {users.age}</p>
                            <p className={"text-lg"}><span className={"font-bold "}>Marital Status:</span> {users.marital_status}</p>
                            <p className={"text-lg"}><span className={"font-bold "}>Employed:</span> {users.is_employed ? 'Yes' : 'No'}</p>
                            <p className={"text-lg"}><span className={"font-bold "}>Founder:</span> {users.is_founder ? 'Yes' : 'No'}</p>
                            <div className={"flex justify-between items-center gap-3 mt-5"}>
                                <div onClick={() => handleEditUser(index)} className={"flex justify-between items-center gap-2 bg-amber-200 hover:bg-amber-300 text-black text-xl font-semibold p-2 border border-gray-900 rounded-full cursor-pointer "}><MdEdit width={50} height={50} />
                                    <span>Edit</span></div>
                                <div onClick={() => handleDeleteUser(index)} className={"flex justify-between items-center gap-2 p-2 text-black text-xl font-semibold border bg-red-200 hover:bg-red-300 border-black rounded-full cursor-pointer"}><MdDeleteForever width={50} height={50} /><span>Delete</span></div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </>
    )

}
export default User;