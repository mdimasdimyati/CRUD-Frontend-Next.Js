import React from 'react'
import { Modal, ModalOverlay, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '@chakra-ui/modal'

const ModalGlobal = ({isOpen, onClose, children, title}) => {
    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {children}
                    </ModalBody>
                </ModalContent>
            </Modal>
    )
}

ModalGlobal.prototype = {};
export default ModalGlobal
