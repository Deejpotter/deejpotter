import React from "react";

function Cloudinary(props) {
    return (
        <CloudinaryContext cloudName="deejpotter">
            <div>
                <Image publicId="sample" width="50" />
            </div>
            <Image publicId="sample" width="0.5" />
        </CloudinaryContext>
    );
}

export default Cloudinary;