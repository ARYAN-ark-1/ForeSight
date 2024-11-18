import React, { useEffect } from 'react';

const SetTitle = () => {
  useEffect(() => {
    // Set the document title to "Foresight"
    document.title = "Foresight";
  }, []); // Empty dependency array to set title only once when the component mounts

  return (
    <div>
      <h1>Welcome to Foresight!</h1>
      <p>This is your app with the title set to Foresight.</p>
    </div>
  );
};

export default SetTitle;
