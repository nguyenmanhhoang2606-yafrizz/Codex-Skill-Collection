# Desert Eagle · Reference Console

Mở **[demo.html](demo.html)** bằng Chrome/Edge/Firefox có WebGL. HTML chứa mã,
font và mô hình, không cần server hay tải tài nguyên khi xem.

Bản này chuyển demo ngoại hình sang cấu trúc và bố cục của tác giả teardown:
[V8 live](https://github.com/elvarofficial/teardown/tree/a91262ac1109051e014662d42ecb0b7bc1f113b1/sims/v8-live),
[v8-shared](https://github.com/elvarofficial/teardown/tree/a91262ac1109051e014662d42ecb0b7bc1f113b1/sims/v8-shared).
Nguồn upstream theo MIT; thông báo bản quyền được nhúng trong HTML.

- `console.js` / `style.css`: chuyển thể lưới console 1600×900, phân cấp chữ,
  màu đỏ, bảng hai bên, thanh điều khiển và đường chú thích của V8.
- `stage.js`: chuyển thể nền studio, softbox, bóng, camera và phép chiếu nhãn.
- `live.js`: chuyển thể tour và điều khiển camera, tự trở lại tour sau 25 giây
  không thao tác; nút Dừng giữ trạng thái dừng cho đến khi người xem bật lại.
- `film.js`: trạng thái thuần theo thời gian cho tour 24 giây và chụp ảnh.
- `model.js`: mô hình ngoại hình thủ tục từ demo trước, dựa trên ảnh Desert Eagle
  nhìn ngang và gợi ý vật liệu trong ảnh concept người dùng cung cấp.

Kéo để xoay, cuộn để zoom; chọn camera, vật liệu, độ nhám hoặc ánh sáng ở các
bảng. Thanh thời gian chọn mốc tour. H ẩn/hiện bảng; Space bật/dừng tour.
Lưu PNG xuất riêng cảnh 3D; ảnh toàn console dùng chức năng chụp màn hình.
Điện thoại nên xoay ngang. Thiết lập giảm chuyển động được tôn trọng khi mở.

Đây là nghiên cứu hình thức bên ngoài, còn mang phong cách mô hình thủ tục;
không phải bản sao CAD hoặc mô phỏng cơ khí. Các bảng hiển thị trạng thái camera
và vật liệu thật. Không có cấu tạo vận hành, tháo lắp hay thông số chế tạo.
Không sử dụng ảnh GSG-1911 đã gửi nhầm. Không tuyên bố chất lượng mô hình ngang
với toàn bộ showcase của tác giả. [Bản trước](../desert-eagle-viewer/demo.html)
được giữ nguyên để so sánh.

## Build và kiểm tra

Sau khi chạy `scripts/setup-teardown.sh` từ gốc repo:

```sh
python3 examples/desert-eagle-console/build.py
node examples/desert-eagle-console/smoke.cjs
```

Có thể đặt `TEARDOWN_SKILL_DIR` nếu skill nằm ở đường dẫn khác. Test dùng
Playwright Chromium, lưu kết quả và ảnh trong `/tmp/teardown-console-test`.
Xem [checklist và giới hạn kiểm chứng](../../research/evaluations/teardown-console-checklist.md).
