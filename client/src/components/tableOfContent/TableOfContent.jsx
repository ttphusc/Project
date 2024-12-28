import { generateTableOfContents } from "../../helps/stripHtml";

// Component React để hiển thị Table of Contents
const TableOfContents = ({ htmlContent }) => {
  // Tạo table of contents từ hàm generateTableOfContents
  const tableOfContentsHtml = generateTableOfContents(htmlContent);

  return (
    <div className="table-of-contents p-4 border-l-2 border-gray-300 sticky top-16">
      <h3 className="text-lg text-green-800 font-bold mb-4">
        TABLE OF CONTENTS
      </h3>
      <div
        className="space-y-2"
        dangerouslySetInnerHTML={{ __html: tableOfContentsHtml }}
      />
    </div>
  );
};

export default TableOfContents;
