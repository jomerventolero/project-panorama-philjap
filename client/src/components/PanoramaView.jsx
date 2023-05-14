/**
 * This is a React component that renders a link to load a panorama.
 * @returns A React functional component that renders a div containing a hyperlink with the text "Load
 * Panorama".
 */
import React from 'react';

function PanoramaViewer() {

  return (
    <div>
          <a
          className="font-medium text-white cursor-pointer"
          href="http://localhost:80"
          >Load Panorama</a>
    </div>
  );
}

export default PanoramaViewer;