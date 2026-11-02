# Grammar Garden – Present Perfect

## Cách chạy trong VS Code
1. Giải nén `present-perfect-study.zip`.
2. Mở VS Code → File → Open Folder… → chọn thư mục `present-perfect-study`.
3. Cài extension **Live Server** (nếu chưa có): mở Extensions (`Ctrl + Shift + X`), tìm `Live Server`, chọn Install.
4. Mở file `index.html`, nhấn chuột phải → **Open with Live Server**.
5. Trang web sẽ mở trên trình duyệt. Không nên mở trực tiếp bằng cách nhấp đúp `index.html`, vì trình duyệt có thể chặn việc đọc `data.json`.

## Chỉnh sửa kiến thức
- Mở `data.json` để sửa tiêu đề, nhóm dấu hiệu, giải thích, ví dụ và bài tập.
- Hoặc mở trang web → Quản lí dữ liệu → Xuất JSON / nhập JSON / chỉnh sửa nhanh JSON.
- Sau khi sửa file `data.json`, tải lại trang để xem thay đổi.
- Nếu đã nhập JSON vào trang web, dữ liệu được lưu trong `localStorage` của trình duyệt và sẽ được ưu tiên khi mở lại. Muốn dùng lại file `data.json` gốc, vào Quản lí dữ liệu và nhập file đó hoặc xóa dữ liệu trang web trong cài đặt trình duyệt.

## Cấu trúc thư mục
- `index.html`: khung giao diện.
- `style.css`: màu sắc, bố cục và responsive.
- `app.js`: chức năng mindmap, tìm kiếm, bài tập, nhập/xuất JSON.
- `data.json`: toàn bộ nội dung kiến thức và câu hỏi; bạn có thể chỉnh sửa.

## Lưu ý về JSON
- Dùng dấu ngoặc kép `"` cho tên trường và chuỗi.
- Không đặt dấu phẩy sau phần tử cuối cùng trong object/array.
- Giữ các trường `id` ổn định và không trùng nhau.
- Nên giữ một bản sao JSON trước khi chỉnh sửa.
- Nếu trang báo JSON không hợp lệ, kiểm tra dấu phẩy, ngoặc và dấu ngoặc kép.

## Nội dung học tập
Các dấu hiệu trong trang là gợi ý nhận biết phổ biến, không phải quy tắc tuyệt đối. Hãy xét cả cấu trúc và ngữ cảnh. Ví dụ được thiết kế ở mức cơ bản để phục vụ học tập.
