import React from "react";

export const TableContainer = ({ children }) => (
  <div className="w-full overflow-x-auto bg-white border border-gray-300 rounded-lg">
    <div className="min-w-max">{children}</div>
  </div>
);

export const Table = ({ children }) => (
  <table className="w-full border-collapse table-auto">{children}</table>
);

export const TableHead = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y">{children}</tbody>
);

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-100">{children}</tr>
);

export const TableCell = ({ children, align = "left", className }) => (
  <td
    className={`px-4 py-2 text-${align} ${className}`}
    style={{
      whiteSpace: "nowrap", // Ngăn nội dung xuống dòng không cần thiết
      wordBreak: "break-word",
      overflow: "hidden",
      minWidth: "50px", // Cột có thể co lại nhưng không nhỏ hơn mức này
      maxWidth: "300px", // Đảm bảo cột không quá rộng nếu nội dung quá dài
    }}
  >
    {children}
  </td>
);
