import React, {useState, useEffect} from 'react'
import { Container } from "@chakra-ui/react"
import axios from 'axios'
import {Table,Thead,Tbody,Tr,Th,Td} from "@chakra-ui/react"
import ModalGlobal from '../../components/modalGlobal'
import { Button } from "@chakra-ui/button"
import {FormControl,FormLabel} from "@chakra-ui/react"
import { Input } from '@chakra-ui/input'
import { Select } from '@chakra-ui/select'
import { useFormik } from 'formik';


const UserPage = () => {
    const [usersData, setUsersData] = useState([])
    const [isModalShow, setModalShow] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const [editedId, setEditedId] = useState(null)

    const formik = useFormik({
        initialValues: {
        fullName: '',
        email: '',
        password: '',
        role: '',
        },
        onSubmit: async (values) => {

            if(isEdit){
                await updateUser(editedId, values)
            }else{
                await createUser(values)
            }
            return closeModal();
        },
    });

    const showModal = () => {
        setEdit(false);
        setModalShow(true)
    }
    const closeModal = () => {
        setModalShow(false)
        formik.resetForm();
    }


    const getUsers = async () => {
        try {
            const {data} = await axios.get("http://localhost:5000/users")
            
            setUsersData(data.users)
            // console.log(data);
        } catch (error) {
            console.log(error);            
        }
    };

    const createUser = async (data) => {
        try {
            const config = { "content-type" : "Aplication/json",}
            const response = await axios.post('http://localhost:5000/users', data, config)

            //untuk menampilkan data yang baru diinputkan di sisi frontend
            setUsersData((prev) => {
                return [...prev, response.data.user]
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getUserById = async (id) => {
        try {

            setEdit(true);

            const {data} = await axios.get(`http://localhost:5000/users/${id}`)
            // null police >> data?.user?.fullName sama dengan if(data && data.user && data.user.fullName){//...}
            formik.setValues({
                fullName: data?.user?.fullName,
                email: data?.user?.email,
                password: data?.user?.password,
                role: data?.user?.role,
            })

            setEditedId( data?.user?.id,)
            setModalShow(true)
        } catch (error) {
            console.log(error);
        }
    }



    const updateUser = async (id, form) => {
        try {
            const config = { "content-type" : "Aplication/json",}
            //proses update data server
            const {data} = await axios.patch(`http://localhost:5000/users/${id}`, form, config)
            
            //untuk menampilkan data baru setelah diupdate
            const newUpdateUser = usersData.map((user) => user.id === id ? {
                ...user,
                ...form
            } : user);
            setUsersData(newUpdateUser)
            closeModal()
        } catch (error) {
            console.log(error);
        }
    }
    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`)

            //untuk mereturn data yang tidak di delete
            const filteredUsers = usersData.filter((user) => user.id !== id)
            setUsersData(filteredUsers)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
       getUsers();
    }, [])

 
    return (
        <Container>
            <Button size="lg" colorScheme="facebook" onClick={showModal}>Create</Button>
           <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th isNumeric>Role</Th>
                    <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {usersData.map((value) => (
                        <Tr key={value.id}>
                            <Td>{value.fullName}</Td>
                            <Td>{value.email}</Td>
                            <Td isNumeric>{value.role}</Td>
                            <Td>
                                <Button colorScheme="whatsapp" my={2} width="100%" type="submit" onClick={() => {getUserById(value.id)}}>
                                    Edit
                                </Button>
                                <Button colorScheme="red" my={3} width="100%" type="submit" onClick={() => {const result = confirm("Want to delete?"); result && deleteUser(value.id)}}>
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                  
                </Tbody>
            </Table>
            <ModalGlobal isOpen= {isModalShow} onClose={closeModal} title={isEdit ? "Update Data" : "Create Data"}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl id="fullName" isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input name="fullName" onChange={formik.handleChange} value={formik.values.fullName} type="text" placeholder="Input full name..."/>
                    </FormControl>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input name="email" onChange={formik.handleChange} value={formik.values.email} type="email" placeholder="Input emai..."/>
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" onChange={formik.handleChange} value={formik.values.password} type="password" placeholder="password" />
                    </FormControl>
                    <FormControl id="role" isRequired>
                        <FormLabel>Role User</FormLabel>
                    <Select name="role" onChange={formik.handleChange} value={formik.values.role} placeholder="Select Role">
                            <option>Admin</option>
                            <option>User</option>
                        </Select>
                    </FormControl>
                     <Button isLoading={formik.isSubmitting} type="submit" colorScheme="whatsapp" my={5} width="100%">{isEdit ? "Update" : "Save"} Data</Button>
                </form>
            </ModalGlobal>
        </Container>
    )
}

export default UserPage