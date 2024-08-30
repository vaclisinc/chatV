import { getAuth, updateProfile } from "firebase/auth";
const auth = getAuth();
updateProfile(auth.currentUser, {
    displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(() => {
    // Profile updated!
    // ...
}).catch((error) => {
    // An error occurred
    // ...
});


// ProfilePage.js

import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

function ProfilePage() {
    const [profilePhoto, setProfilePhoto] = useState(null);

    // Function to handle profile photo upload
    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        setProfilePhoto(file);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`profilePhotos/${profilePhoto.name}`);
        await fileRef.put(profilePhoto);

        console.log('Profile photo uploaded successfully.');

        // Here you can update the user's profile with the new photo URL
        // For example, if you're using Firebase Authentication:
        const user = firebase.auth().currentUser;
        if (user) {
            const photoURL = await fileRef.getDownloadURL();
            await user.updateProfile({ photoURL });
            console.log('Profile photo URL updated:', photoURL);
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="profilePhoto">Profile Photo:</label>
                    <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
            <div>
                {profilePhoto && (
                    <div>
                        <h2>Preview:</h2>
                        <img
                            src={URL.createObjectURL(profilePhoto)}
                            alt="Profile Preview"
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
