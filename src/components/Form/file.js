import React, { useState } from 'react'
import { Button, Modal,Form } from 'react-bootstrap'
import { openUploadWidget } from "../../util/CloudinaryService";
function FileForm() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const beginUpload = tag => {
       
        const uploadOptions = {
         cloudName: 'dtqzhg98l',
          tags: [tag,"my image"],
          uploadPreset: 'vdkuxmpd'
        };
      
        openUploadWidget(uploadOptions, (error, photos) => {
          if (!error) {
            console.log(photos);
            if(photos.event === 'success'){
             console.log(photos.info.secure_url)
            }
          } else {
            console.log(error);
          }
        })
      }
   
    return (
        <>
            <Button className="btn btn-primary mx-2" onClick={handleShow}>
                File Upload
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>AA DRIVE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>File Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter File Name" />
                            </Form.Group>
                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                    </Form>
                    <button onClick={() => beginUpload()} className="my-3 btn btn-info mb-5 w-100">+Upload ile</button>
                            <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FileForm