# Thử nghiệm teardown với Codex — 2026-11-06

## Kết luận trong phạm vi thử nghiệm

Codex có thể đọc hướng dẫn teardown, dùng bộ build và runtime của skill để tạo
một trang 3D tương tác chạy offline. Đã thử bằng nghiên cứu ngoại hình Desert Eagle
cách điệu. Đây là bằng chứng tương thích công cụ của một mẫu, chưa phải bằng chứng
skill nâng chất lượng Codex trên mọi tác vụ.

Skill nguồn: `elvarofficial/teardown`, commit
`a91262ac1109051e014662d42ecb0b7bc1f113b1`. Không sửa mã nguồn skill đã lưu.

## Đã sử dụng thực tế

- Đọc `SKILL.md` từ bản cài local; dùng hướng dẫn external machine folder.
- Build bằng `sims/build.mjs` của skill, dùng `teardown-kit/runtime.js` và
  `teardown-kit/warm.js` trong scene mới.
- Three.js 0.186.1 và fonts được nhúng bởi bộ build của skill.
- Codex viết ngoại hình, giao diện tiếng Việt và kiểm tra bằng Playwright.
- Artifact: `examples/desert-eagle-viewer/demo.html`, khoảng 792 KB gồm giấy phép.

## Kiểm chứng

Browser smoke check: `node examples/desert-eagle-viewer/smoke.cjs`.
Các kiểm tra gồm khởi động runtime, camera preset, kéo xoay, cuộn zoom, đổi chất
liệu, bật tự xoay và viewport mobile. Chặn mọi request HTTP/HTTPS để kiểm tra offline.
Ảnh desktop/mobile và các góc nhìn được đọc trực tiếp; đã phát hiện và sửa việc
mô hình bị cắt ở cạnh màn hình mobile. Kiểm tra console/page errors và tràn ngang.

Môi trường: Chromium 145/Playwright 1.58.2 trên Linux, WebGL2 qua ANGLE/SwiftShader.
Render mẫu ghi nhận khoảng 6.792 tam giác và 339 draw calls (gồm pass bóng).
Không đưa ra cam kết 60 fps từ môi trường dựng bằng CPU này.

## Giới hạn và đánh giá chất lượng

- Hai trang tham khảo ngoại hình (Wikipedia và trang Desert Eagle của Magnum
  Research) trả HTTP 403. Mẫu được đánh dấu là minh họa cách điệu; chưa kiểm chứng
  độ giống sản phẩm thật. Hình còn mang dạng khối đơn giản, chưa đạt chất lượng
  photorealistic hoặc tiêu chuẩn phục dựng chính xác.
- Mẫu tập trung vào ngoại hình, camera, vật liệu và UI. Chưa kiểm tra mô phỏng cơ
  học, xuất video, âm thanh, chất lượng trên GPU tích hợp hoặc thiết bị thật.
- Khả năng Codex tự phát hiện skill trong catalog chưa được xác nhận. Phiên này
  gọi bằng cách đọc `SKILL.md` và dùng đường dẫn trực tiếp.
- Chưa có thử nghiệm đối chứng cùng prompt không dùng skill, nên chưa thể kết luận
  mức cải thiện chất lượng, token hay thời gian so với Codex thông thường.

## Đề xuất

Giữ teardown làm công cụ tạo trang 3D tương tác và đóng gói offline cho Codex.
Giá trị đã chứng minh: bundler, runtime, fonts, shader warm-up và quy trình xem
ảnh. Độ giống vật thể phụ thuộc nhiều vào ảnh tham khảo và công việc dựng hình
của agent. Lần đánh giá tiếp theo nên dùng một vật thể cơ khí dân dụng có ảnh
tham khảo truy cập được và cùng prompt đối chứng, rồi mới chấm hiệu quả skill.

Kết quả lần chạy cuối: PASS các tương tác nêu trên; `errors=[]`,
`externalRequests=[]`, `overflow=false`, `SIM.ready=true`. JSON bằng chứng ở
`research/evaluations/2026-11-06-teardown-browser-result.json`;
ảnh desktop ở `examples/desert-eagle-viewer/preview.png`.
