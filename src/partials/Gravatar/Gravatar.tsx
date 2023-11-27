import React from "react";
import md5 from "md5";

interface GravatarProps {
  email: string;
  size?: number;
  className?: string;
}

const Gravatar: React.FC<GravatarProps> = ({ email, size = 32, className }) => {
  const hash = md5(email.toLowerCase().trim());
  const url = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;

  return (
    <img
      src={url}
      alt="User Avatar"
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default Gravatar;
