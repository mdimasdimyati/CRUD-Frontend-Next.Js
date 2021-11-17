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

            //untuk reset form
            formik.resetForm();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
       getUsers();
    }, [])

    const showModal = () => {
        setModalShow(true)
    }
    const closeModal = () => {
        setModalShow(false)
    }

    const formik = useFormik({
        initialValues: {
        fullName: '',
        email: '',
        password: '',
        role: '',
        },
        onSubmit: async (values) => {
            await createUser(values)

            return closeModal();
        },
    });

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
                    {usersData.map((users) => (
                        <Tr key={users.id}>
                            <Td>{users.fullName}</Td>
                            <Td>{users.email}</Td>
                            <Td isNumeric>{users.role}</Td>
                        </Tr>
                    ))}
                  
                </Tbody>
            </Table>
            <ModalGlobal isOpen= {isModalShow} onClose={closeModal} title="Create User">
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
                     <Button isLoading={formik.isSubmitting} type="submit" colorScheme="whatsapp" my={5} width="100%">Save</Button>
                </form>
            </ModalGlobal>
        </Container>
    )
}

export default UserPage