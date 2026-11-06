# Rà soát demo DE sau bản V8 Reference Edition

Ngày: 2026-11-06. Bản được review: commit `1e6a49b`.
Chuẩn chính: HTML build từ `v8-live` của tác giả. File Claude do người dùng
cung cấp chỉ dùng để so sánh phạm vi, không thay chuẩn hoặc làm nguồn code.

Đã mở lại cả ba HTML trong Chromium / SwiftShader ở 1600×900, chặn mọi HTTP,
chụp ảnh và thực hiện các thao tác tái hiện. `results.json` chứa dữ liệu quan sát.
Không sửa demo trong lượt review này. Không đánh giá độ chính xác cơ khí của
file Claude và không coi các số liệu trong file đó là đã kiểm chứng.

## Kết luận

Bản DE đã gần V8 về khung trình bày, nhưng vẫn là viewer ngoại hình với camera
tour, chưa tương đương độ sâu khám phá/mô phỏng của V8. Khớp panel và chạy được
không chứng minh đầy đủ chức năng, tính trực quan hoặc chất lượng hình học.

## Lỗi và hành vi chưa hoàn thiện đã tái hiện

1. **Focus mục 7 không làm nổi bật hình 3D.** Reset → chọn số 7 → tắt Focus.
   Canvas PNG trước/sau giống hệt. Mục này chỉ có decal MeshBasicMaterial, không
   nằm trong danh sách `meshes` được vòng cập nhật emissive xử lý.
   Nguồn: `examples/desert-eagle-v8/model.js:63`, `model.js:66`.
2. **Space trên nút Pause bị kích hoạt hai lần.** Reset → focus nút Pause → Space:
   paused=true trước và sau. Handler riêng gọi click rồi sự kiện tiếp tục nổi
   lên handler window, gọi click lần hai.
   Nguồn: `live.js:47`, `live.js:62`.
3. **“Drag to scrub” chỉ phản ứng lúc nhấn.** Nhấn ở 20% biểu đồ cho t=5.2;
   giữ và kéo đến 80% vẫn t=5.2. Chỉ có onpointerdown, không theo dõi pointermove.
   Nguồn: `live.js:57`.
4. **Reduced motion chặn cả thao tác Play chủ động.** Mở trang với reduce → Play:
   paused=false nhưng t=0 sau 20 animation frames. Điều kiện !reduce trong nhánh
   playback thủ công vẫn chặn cập nhật. Resume Tour đi qua nhánh khác.
   Nguồn: `live.js:73`.
5. **“Tour speed” không được giữ khi Resume Tour.** Chọn 1.5×, bật Resume Tour:
   giá trị về 1×. Slider chỉ sửa manual.speed; auto dùng stateAt(t) có speed=1.
   Đây là hành vi cần làm rõ/sửa theo nhãn điều khiển, không kết luận mọi reset
   speed đều là lỗi của V8 gốc.
   Nguồn: `live.js:56`, `live.js:72`, `film.js:21`.
6. **“Click to inspect” chưa thực sự đưa người xem đến chi tiết.** Chọn mục 3
   giữ nguyên toàn bộ camera; chỉ đổi feature và bật focus. Đây là khoảng thiếu
   UX, không phải lỗi WebGL. Chuyển camera bằng nút cũng gán trực tiếp vị trí,
   thiếu easing mà live.js V8 gốc áp dụng.
   Nguồn: `live.js:48`, `live.js:53`; V8 `v8-shared/live.js:337`.

## Khoảng thiếu so với các reference

| Mặt đánh giá | V8 gốc | DE hiện tại | Claude, chỉ để so sánh |
|---|---|---|---|
| Khung UI | Console kỹ thuật thống nhất | Giữ được layout chính | Một hệ bố cục khác, không phải chuẩn được chọn |
| Nội dung | Trạng thái mô hình dẫn dắt readout, biểu đồ và lựa chọn | Phần lớn là camera, finish và mô tả bề mặt | Có UI trạng thái/sequence và nhiều chế độ hiển thị hơn |
| Khám phá | Theo dõi, isolate và các chế độ quan sát sâu | Tám vùng ngoại hình, đổi màu và đường cạnh | Có các chế độ nội cảnh trong file; độ đúng chưa thẩm định |
| Tour | Camera, selection, trạng thái và con trỏ được phối hợp | Chủ yếu đổi camera/finish; con trỏ chỉ trỏ nút camera | Có chuỗi thao tác phong phú hơn |
| Chất lượng hình | Nhiều chi tiết liên kết, vật liệu phân biệt rõ | Hình khối còn giản lược, mảng kim loại lớn phẳng, chữ nhỏ | Bản Claude cũng còn hình khối thô; không mặc định chính xác hơn |

Các phần cơ cấu bên trong/section/x-ray của vũ khí không có trong phạm vi demo
ngoại hình này; ghi nhận đó là khác biệt phạm vi, không đề xuất chép cơ cấu từ
file Claude. Ngay trong phạm vi ngoại hình vẫn có thể nâng chất lượng mô hình,
focal framing, chọn vùng, nhãn và mô tả bề mặt.

Hai biểu đồ camera có dữ liệu thực nhưng không giúp hiểu đối tượng nhiều bằng
các biểu đồ về cơ chế trong V8. Chúng đang lấp các ô của template nhiều hơn là
thực hiện vai trò giải thích tương đương. Nhãn mô tả còn chung chung. Tour có
thay surface/finish nhưng con trỏ chỉ minh họa các nút camera, nên một số thay
đổi thiếu nguyên nhân hiển thị rõ cho người xem. Nhãn neo ở một vài vị trí cố
định; chưa kiểm chứng tránh che khuất cho mọi góc quay tự do.

## Giới hạn của kiểm tra trước

`verify.cjs:17` kiểm tra bảy panel, CSS của một phần tử .cp và ba nút transport;
không phải kiểm tra toàn bộ typography hoặc toàn bộ UI. Kiểm tra focus ở dòng 24
chỉ xác nhận state.feature và overlays.focus, không xác nhận hình được highlight.
Test slider chỉ xem giá trị state, không kiểm tra playback sau Resume Tour.
Vì thế “15 nhóm kiểm tra đạt” là đúng về phạm vi test, nhưng không đủ để kết luận
trải nghiệm hoàn thiện hoặc ngang showcase.

## Thứ tự cải thiện đề xuất

1. Sửa các lỗi tương tác tái hiện được và thêm kiểm tra kết quả hiển thị/hành vi.
2. Hoàn thiện inspection: camera chuyển mượt, chọn vùng có framing phù hợp,
   highlight thật cho mọi mục, nhãn gắn với phần đang xem và ít che mô hình.
3. Đối chiếu hình dáng/vật liệu với ảnh ref ở các góc tương ứng; tinh chỉnh mô hình.
4. Biên tập lại panel và tour để mỗi bảng, số liệu, thay đổi đều có mục đích rõ.
5. Kiểm tra mobile landscape và máy dùng GPU tích hợp; hiệu năng chưa được chứng minh.

Không thể suy ra tác động riêng của Extra High từ kết quả này.
