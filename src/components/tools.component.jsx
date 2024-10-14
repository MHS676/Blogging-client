// editor-tools.jsx
import Edmed from '@editorjs/embed';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Inlinecode from '@editorjs/inline-code';
import { uploadImage } from '../common/aws'; // Adjust the path as necessary

// Function to handle file uploads
const uploadImageByFile = (file) => {
    return uploadImage(file)
        .then((url) => {
            if (url) {
                return {
                    success: 1,
                    file: { url },
                };
            } else {
                return {
                    success: 0,
                    message: "Failed to upload the image.",
                };
            }
        })
        .catch((error) => {
            console.error('Error uploading image:', error);
            return {
                success: 0,
                message: "An error occurred while uploading the image.",
            };
        });
};

// Function to handle URL uploads
const uploadImageByURL = (url) => {
    return new Promise((resolve, reject) => {
        if (url) {
            resolve({
                success: 1,
                file: { url },
            });
        } else {
            reject({
                success: 0,
                message: "Invalid URL.",
            });
        }
    }).catch((error) => {
        console.error('Error uploading image by URL:', error);
        return {
            success: 0,
            message: "An error occurred while uploading the image by URL.",
        };
    });
};

// Export Editor.js tools configuration
export const tools = {
    embed: Edmed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            },
        },
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading......",
            levels: [2, 3],
            defaultLevel: 2,
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlinecode: Inlinecode,
};
