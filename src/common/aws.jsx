// // aws.jsx
//  import axios from 'axios';

// export const uploadImage = async (img) => {
//     let imgUrl = null;

//     try {
//         // Fetch presigned URL from your server
//         const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/get-upload-url`);
        
//         console.log('Presigned URL Response:', response); // Debug log

//         // Safely extract the upload URL
//         const uploadUrl = response?.data?.uploadURL;

//         // Check if the uploadUrl is properly defined
//         if (!uploadUrl) {
//             throw new Error('Upload URL is not defined');
//         }

//         console.log('Uploading to URL:', uploadUrl); // Log the upload URL

//         // Upload image to S3 using the presigned URL
//         await axios.put(uploadUrl, img, {
//             headers: { 'Content-Type': 'image/jpeg' },
//         });

//         // Extract the URL without query parameters
//         imgUrl = uploadUrl.split('?')[0];
//     } catch (error) {
//         console.error('Error uploading image:', error);
//     }

//     return imgUrl;
// };

// aws.jsx
import axios from 'axios';

export const uploadImage = async (img) => {
    let imgUrl = null;

    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('image', img); // Ensure this matches what your server expects

        // Fetch presigned URL from your server
        const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-upload-url`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
            },
        });
        
        console.log('Presigned URL Response:', response.data); // Log the entire response

        // Safely extract the image URL from the response
        const imageUrl = response?.data?.imageUrl;

        // Check if the imageUrl is properly defined
        if (!imageUrl) {
            throw new Error('Image URL is not defined');
        }

        console.log('Image URL:', imageUrl); // Log the image URL

        // If you're uploading directly to Cloudinary and this is the final image URL, you can return it directly
        imgUrl = imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    return imgUrl;
};




