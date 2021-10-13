// Image upload form element
// Provides file picker interface (hidden), file preview and "Pick Image" button
import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  // file picker input element is hidden for aesthetic reasons. instead, a
  // useRef is used (filePickerRef) to indirectly click the input element.
  // Button's onClick calls pickImageHandler to do a click on filePickerRef.
  // that then triggers pickedHandler to get selected filename. a useEffect
  // is also used to update the image preview when a file is selected.

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  // generate file preview
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();  // FileReader is part of browser

    // update the URL for the image preview element
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    // read image into a URL representing the file's data
    fileReader.readAsDataURL(file);
  }, [file]);

  // change handler for file input element
  // gets/saves filename
  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;  // use a var to avoid problem isValid state update that
                                // is SCHEDULED and thus won't change before onInput call
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    // update inputs & isValid fields for the form element
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  // trigger the file input element change handler with a synthetic click
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  // Note that the file picker input is hidden; access is
  // through the filePickerRef
  return (
    <div className="form-control">
      <input
        type='file'
        style={{ display: 'none' }}
        ref={filePickerRef}
        id={props.id}
        accept='.jpg,.png,.jpeg'
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
