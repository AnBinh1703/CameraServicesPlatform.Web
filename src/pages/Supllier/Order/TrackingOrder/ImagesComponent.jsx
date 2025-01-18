import React from "react";

const ImagesComponent = ({ beforeImageUrl, afterImageUrl }) => (
  <div>
    {beforeImageUrl && (
      <div>
        <h3>Hình ảnh sản phẩm trước thuê</h3>
        <img src={beforeImageUrl} alt="Before" style={{ maxWidth: "100%" }} />
      </div>
    )}
    {afterImageUrl && (
      <div>
        <h3>Hình ảnh sản phẩm sau thuê</h3>
        <img src={afterImageUrl} alt="After" style={{ maxWidth: "100%" }} />
      </div>
    )}
  </div>
);

export default ImagesComponent;
