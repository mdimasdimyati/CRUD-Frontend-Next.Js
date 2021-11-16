import React, {useState} from 'react'
import { Button } from "@chakra-ui/button"
import { Modal, ModalBody, ModalHeader, ModalCloseButton,  ModalContent, ModalOverlay } from '@chakra-ui/modal'

const UserPage = () => {
    const [isModalShow, setIsModalShow] = useState(false)
    const handleOpenModal = () => {
        setIsModalShow(true)
    }
    const handleCloseModal = () => {
        setIsModalShow(false)
    }

    return (
        <div>
            <Button colorScheme="blue" onClick={handleOpenModal}>Button</Button>
            <Modal motionPreset="slideInBottom" isOpen={isModalShow} onClose={handleCloseModal}> 
                <ModalOverlay />
                <ModalContent pb={5}>
                    <ModalHeader>Login now</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <h1>lorem3</h1>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UserPage