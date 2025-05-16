export const convertFormData = (data) => {
    // Handle array input
    if (Array.isArray(data)) {
        return data.map(item => convertFormData(item));
    }

    const convertedData = {};
  
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const value = data[key];
  
        // Nếu giá trị có thể là số, chuyển đổi sang số
        if (!isNaN(value) && value.trim() !== "") {
          convertedData[key] = Number(value);
        }
        // Nếu giá trị là boolean (true/false)
        else if (value === "true" || value === "false") {
          convertedData[key] = value === "true";
        }
        // Nếu giá trị là danh sách phân cách bởi dấu phẩy
        else if (
          value.includes(",") &&
          value.split(",").every((item) => !isNaN(item))
        ) {
          let tmp = value.split(",");
          let isNumber = tmp.every((item) => !isNaN(item));
          if (isNumber)
            convertedData[key] = value.split(",").map((item) => {
              if (!isNaN(item) && item.trim() !== "") {
                return Number(item);
              }
              // Nếu giá trị là boolean (true/false)
              else if (item === "true" || item === "false") {
                return item === "true";
              }
            });
        }
        // Nếu không, giữ nguyên giá trị chuỗi
        else {
          convertedData[key] = value;
        }
      }
    }
  
    return convertedData;
  };