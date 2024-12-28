// Hàm loại bỏ HTML và trả về chỉ nội dung văn bản
export const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Hàm tạo Table of Contents dựa trên các thẻ H1 và bôi đen
export const generateTableOfContents = (htmlContent) => {
  // Tạo một DOM parser để phân tích cú pháp chuỗi HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Lấy tất cả các thẻ H1 trong nội dung
  const headings = doc.querySelectorAll("h1");

  // Tạo một danh sách table of contents dưới dạng mảng
  const tableOfContents = Array.from(headings).map((heading) => {
    // Sử dụng stripHtml để loại bỏ các thẻ HTML không cần thiết
    const cleanText = stripHtml(heading.innerHTML);
    return `<li><strong>${cleanText}</strong></li>`;
  });

  // Trả về chuỗi HTML của danh sách table of contents
  return `<ul>${tableOfContents.join("")}</ul>`;
};
