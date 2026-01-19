import React, { useState, useEffect } from "react";
import img1 from "../assets/avatar1.png";
import img2 from "../assets/avatar2.png";
import img3 from "../assets/avatar3.png";
import img4 from "../assets/avatar4.png";
import img5 from "../assets/avatar5.png";
import img6 from "../assets/avatar6.png";
import img7 from "../assets/avatar7.png";
import img8 from "../assets/avatar8.png";
import img9 from "../assets/avatar9.png";

export const avatar1 = img1;
export const avatar2 = img2;
export const avatar3 = img3;
export const avatar4 = img4;
export const avatar5 = img5;
export const avatar6 = img6;
export const avatar7 = img7;
export const avatar8 = img8;
export const avatar9 = img9;

const avatars = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const AvatarSelection = ({ editMode }) => {
  // State to hold the selected avatar index (default to 0)
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Load avatar selection from local storage
    const savedIndex = localStorage.getItem("selectedAvatarIndex");
    
    // Legacy cleanup: remove old key if it exists to avoid confusion
    if (localStorage.getItem("selectedAvatar")) {
        localStorage.removeItem("selectedAvatar");
    }

    if (savedIndex !== null) {
      setSelectedIndex(parseInt(savedIndex, 10));
    }
  }, []);

  const handleAvatarSelect = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedAvatarIndex", index);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {/* View Mode: Show Selected */}
      {!editMode && (
          <div className="position-relative">
             <img
              src={avatars[selectedIndex] || avatars[0]}
              alt="Selected Avatar"
              className="rounded-circle border border-2 border-primary"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
          </div>
      )}

      {/* Edit Mode: Show Selection Grid */}
      {editMode && (
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`rounded-circle cursor-pointer transition-all ${index === selectedIndex ? "border border-4 border-primary" : "opacity-50 hover-opacity-100"}`}
              style={{ 
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transform: index === selectedIndex ? 'scale(1.1)' : 'scale(1)'
              }}
              onClick={() => handleAvatarSelect(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarSelection;
