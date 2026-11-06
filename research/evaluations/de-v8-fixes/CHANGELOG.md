# Log sửa Desert Eagle — V8 Reference Edition

Ngày: 2026-11-06. Bản trước sửa: `1e6a49b`.
Yêu cầu: sửa demo theo báo cáo rà soát và lưu lại những gì đã sửa.
Chuẩn UI: V8 của tác giả teardown. Không dùng code/UI Claude làm nền.
Báo cáo trước sửa được giữ nguyên trong `../de-v8-audit/`.

## Thay đổi và nguyên nhân

| ID | Trước sửa | Đã thay đổi | File |
|---|---|---|---|
| FIX-01 | Focus mục 7 đổi state nhưng canvas không đổi | Thêm viền highlight riêng cho decal chữ; không phụ thuộc emissive của MeshBasicMaterial | model.js |
| FIX-02 | Space trên nút Pause chạy hai handler | Dùng handler kích hoạt bàn phím chung, preventDefault/stopPropagation; handler toàn cục bỏ qua sự kiện đã xử lý | live.js |
| FIX-03 | “Drag to scrub” chỉ nhận pointerdown | Bắt giữ pointer, theo dõi move/up/cancel và ánh xạ đúng miền thời gian trong biểu đồ | live.js |
| FIX-04 | Reduced motion chặn cả Play chủ động | Chỉ tắt tự phát và chuyển camera có animation; Play/Resume do người xem yêu cầu vẫn chạy | live.js |
| FIX-05 | Resume Tour trả tốc độ về 1× | Dùng một playbackSpeed cho cả state hiển thị và bước tiến timeline; giữ tốc độ qua pause/seek/resume | live.js |
| FIX-06 | Play sau pause chỉ xoay camera thủ công | Play/Resume cùng tiếp tục scripted tour tại mốc hiện tại; thao tác quan sát thủ công giữ hình đứng yên | live.js |
| FIX-07 | Chọn vùng không đổi framing, nút camera chuyển đột ngột | Tạo camera inspection theo vị trí từng vùng; chuyển mượt 0.85 giây, bỏ animation khi reduced motion | film.js, live.js |
| FIX-08 | Con trỏ tour chỉ click camera dù có đổi vùng/màu | Một SCRIPT dùng chung cho state, timeline và con trỏ; mỗi beat thực hiện một thao tác camera/surface/finish rõ ràng | film.js, timeline.json |
| FIX-09 | Hai biểu đồ camera ít giúp hiểu đối tượng | Giữ khung panel V8; đổi nội dung thành lịch các bước inspection có scrub và ghi chú bề mặt cụ thể | console.js, film.js |
| FIX-10 | Nhãn neo cố định, dễ chồng lên cảnh cận | Chọn gutter trên/dưới và trái/phải theo điểm chiếu; ẩn callout khi điểm nằm ngoài vùng quan sát | film.js |
| FIX-11 | Mép khối phía trước quá sắc, chữ nhỏ | Tạo bevel cho vỏ ngoài, tăng diện tích chữ; cập nhật vị trí decal/viền để không chìm trong bề mặt | model.js |
| FIX-12 | Kiểm tra highlight chỉ đọc cờ state | Thêm regression test so sánh pixel canvas khi bật/tắt Focus; kiểm tra đủ tám vùng và các chuỗi thao tác từng gây lỗi | regressions.cjs |
| FIX-13 | Khó thấy focus khi dùng bàn phím trên slider | Slider hiện khi nhận keyboard focus; cập nhật aria-pressed và hỗ trợ Space/Enter thống nhất | live.js |

## Quy trình kiểm chứng

1. Chạy regression trên HTML trước sửa: cả 6 lỗi/hành vi đã nêu đều thất bại
   đúng nguyên nhân. Lưu `regressions-before.json`.
2. Sửa source, build lại HTML. Một lượt build phát hiện tên biến `y` bị khai báo
   trùng trong panel notes; đã đổi thành `noteY`. Không coi lượt test trên bundle
   cũ sau build lỗi là bằng chứng (đã dừng lượt đó).
3. Chạy lại regression trên bundle mới: kiểm tra 6 lỗi cũ và ảnh Focus của 8 vùng.
4. Chạy lại bộ verify: offline, pure render, layout V8, controls, capture timeline,
   export PNG, landscape/portrait, reduced motion.
5. Chạy suite repository `python3 -m unittest discover -s tests -v`:
   **19 tests đạt**.
6. Đối chiếu ảnh tour và tám góc inspection; cập nhật preview, contact sheet,
   provenance và tài liệu theo kết quả cuối.

Kết quả cuối của bước 3–4 và kiểm tra ảnh được ghi ở phần dưới sau khi hoàn tất.

## Giới hạn còn lại

- Đây vẫn là mô hình ngoại hình cách điệu, không phải mô phỏng cơ cấu bên trong
  hoặc bản dựng CAD chính xác. Không tuyên bố mọi khác biệt hình dáng với ảnh ref
  đã được loại bỏ.
- Bố cục V8 dày thông tin; portrait vẫn là bản scale có gợi ý xoay ngang.
- Kiểm tra Chromium dùng SwiftShader, không thay thế benchmark GPU tích hợp hoặc
  kiểm tra Firefox/Safari. Logic idle 25 giây không phải kết quả benchmark.
- Bố trí nhãn mới giảm che khuất nhưng chưa chứng minh tránh mọi va chạm ở tất cả
  góc orbit/zoom tự do.

## Kết quả cuối

- **14/14 regression checks đạt**: 6 trường hợp từng thất bại và kiểm tra canvas
  của 8 vùng Focus. So sánh `regressions-before.json` / `regressions-after.json`.
- **15/15 nhóm verify đạt** trên HTML cuối: không có lỗi browser và không có
  request HTTP; state và pixel canvas lặp lại đúng khi render lại cùng mốc.
- **19/19 repository unit tests đạt**.
- Bản HTML cuối: **827,753 bytes**; checksum nằm trong `verification.json`.
- Đã xem lại 10 ảnh tour và contact sheet 8 vùng. Vòng review ảnh phát hiện
  framing của vùng 5/8 quá sát panel; đã giảm độ lệch tâm và lùi camera, sau đó
  chạy lại cả regression lẫn verify trên bundle mới.
- Bảy panel, typography được kiểm tra và vị trí transport vẫn khớp V8 gốc.
- Ảnh inspection: `inspection-sheet.png`. Preview, comparison và tour sheet
  trong thư mục demo đã cập nhật.

- Full-quality tier 0 với GTAO đã render thành công ở 1280×720; ảnh
  `studio-full.png` đã xem và cập nhật. Không suy ra FPS trên GPU thật.
